const db = require('../../db/connection_new.js');
const { generateToken, verifyToken } = require("../../utils/tokenHandler.js");
const bcrypt = require("bcrypt");
const { createHash } = require("crypto");
const { validationResult, matchedData } = require("express-validator");
const Response = require("../../utils/standardResponse.js");
const { fetchUserByEmailOrID } = require("../../models/userModel.js");
const { signupOTP } = require("./otpController.js");
const logger = require ('../../utils/logger.js');
const { getLoginDetails } = require("../../middlewares/userMiddleware");

const validation_result = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validate = (req, res, next) => {
  const errors = validation_result(req).mapped();
  if (Object.keys(errors).length) {
    return res.status(422).json({
      status: 422,
      errors,
    });
  }
  next();
};

const login = async (req, res, next) => {
  try {
    const { email, password, fcm_token } = req.body;

    const fb_token = fcm_token === undefined ? "null" : fcm_token;

    //****check users if user exits*/
    const response = await fetchUserByEmailOrID(email, false);

    if (response.length > 0) {
      const verifyPassword = await bcrypt.compare(
        password,
        response[0].password
      );

      if (!verifyPassword) {
        logger("user_login").error('Wrong Password : ',  email)
        return res.status(422).send(
          Response({
            success: false,
            message: "Incorrect password !",
          })
        );
      }

    //   //******check if user is verified */
    //   // if (response[0].verified === 0) {
    //   //  return res.status(422).json(
    //   //     Response({
    //   //       success: false,
    //   //       message: "User not verified !",
    //   //     })
    //   //   );
    //   // }



      //*** Generating Access and Refresh Token
      const access_token = generateToken({ id: response[0].id });
    
      //*******save in locals */
      req.email = email;
      res.locals.user_id = {"id":response[0].id};
      res.locals.tokens = access_token;

      const user = await getLoginDetails(req,res);

      //***update the fcm_token */
      await db.query("UPDATE users SET fcm_token = ? WHERE email = ?", [fb_token,email])

      res.status(200).json(
        Response({
          success: true,
          message: "User Found",
          data: user.details,
        })
      );
    } else {
      logger("user_login").error('Wrong Credentials : ',  email,password)
      res.status(404).json(
        Response({
          success: false,
          message: "Wrong Email or Password",
        })
      );
    }
  } catch (error) {
    logger("user_login").error('System error : ',  error)
    console.error(error)
    res.status(500).json(
      Response({
        success: false,
        message: `${error}`,
      })
    );
  }
};

const signup = async (req, res, next) => {
  try {
    const response = await fetchUserByEmailOrID(req.body.email, false);

    //*** Check if user exists
    if (Array.isArray(response) && response.length > 0) {
      logger("user_signup").error('Failed Email already exists for : ', req.body.email);
      return res.status(417).json(
        Response({
          success: false,
          message: "Email Already Exists",
        })
      );
    }
    
    try {
      const { user_type, first_name, phone_number, email, password, fcm_token } = matchedData(req);

      const fb_token = fcm_token === undefined ? "null" : fcm_token;

      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
      
      const sendOTP = await signupOTP(req);

      // const sendOTP = true

      if (sendOTP === true) {
        const sql = "INSERT INTO `users` (`first_name`,`phone_number`,`email`,`user_type`,`password`, `fcm_token`,`created_at`) VALUES (?,?,?,?,?,?,?)";
        const values = [first_name, phone_number, email, user_type, hashPassword, fb_token, new Date()];
      
        const result = await db.query(sql, values);

        if (result.affectedRows === 1) {
          //*******create preference with the user's id */
          await db.query("INSERT INTO preferences(user_id) VALUES(?)", [result.insertId])

          //*****create a job type with the user's id */
          await db.query("INSERT INTO job_types(user_id) VALUES(?)", [result.insertId])

          const access_token = generateToken({ id: result.insertId });
          const payload = {
            access_token: access_token,
          };
          
          res.status(201).json(
            Response({
              success: true,
              message: "You have been successfully registered",
              data: payload,
            })
          );
        } else {
          logger("user_signup").error('Failed, something went wrong : ',  result);
          res.status(422).json(
            Response({
              success: false,
              message: "Failed, something went wrong",
            })
          );
        }
      } else {
        logger("user_signup").error('Failed, OTP not sent');
        res.status(422).json(
          Response({
            success: false,
            message: "Failed, something went wrong",
          })
        );
      }
    } catch (error) {
      logger("user_signup").error('System error : ', error);
      res.status(500).json(
        Response({
          success: false,
          message: `Ooops : ${error.message}`,
        })
      );
    }
  } catch (err) {
    logger("user_signup").error('System error : ', err);
    res.status(500).json(
      Response({
        success: false,
        message: `${err}`,
      })
    );
  }
};

// const signup = async (req, res, next) => {
//   try {
//     const response = await fetchUserByEmailOrID(req.body.email, false);

//     //*** Check if user exists
//     if (Array.isArray(response) && response.length > 0) {
//       logger("user_signup").error('Failed Email already exists for : ', req.body.email);
//       return res.status(417).json(
//         Response({
//           success: false,
//           message: "Email Already Exists",
//         })
//       );
//     }

//     let connection;
//     try {
//       connection = await getConnectionPool().getConnection();
//       const { user_type, first_name, phone_number, email, password, fcm_token } = matchedData(req);

//       const fb_token = fcm_token === undefined ? "null" : fcm_token;

//       const saltRounds = 10;
//       const hashPassword = await bcrypt.hash(password, saltRounds);
      
//       const sendOTP = await signupOTP(req);

//       if (sendOTP === true) {
//         const [result] = await connection.execute(
//           "INSERT INTO `users` (`first_name`,`phone_number`,`email`,`user_type`,`password`, `fcm_token`,`created_at`) VALUES (?,?,?,?,?,?,?)",
//           [first_name, phone_number, email, user_type, hashPassword, fb_token, new Date()]
//         );

//         if (result.affectedRows === 1) {
//           const access_token = generateToken({ id: result.insertId });
//           const payload = {
//             access_token: access_token,
//           };
          
//           res.status(201).json(
//             Response({
//               success: true,
//               message: "You have been successfully registered",
//               data: payload,
//             })
//           );
//         } else {
//           logger("user_signup").error('Failed, something went wrong : ',  result);
//           res.status(422).json(
//             Response({
//               success: false,
//               message: "Failed, something went wrong",
//             })
//           );
//         }
//       } else {
//         logger("user_signup").error('Failed, OTP not sent');
//         res.status(422).json(
//           Response({
//             success: false,
//             message: "Failed, something went wrong",
//           })
//         );
//       }
//     } catch (error) {
//       logger("user_signup").error('System error : ', error);
//       res.status(500).json(
//         Response({
//           success: false,
//           message: `Ooops : ${error.message}`,
//         })
//       );
//     } finally {
//       if (connection) {
//         connection.release();
//       }
//     }
//   } catch (err) {
//     logger("user_signup").error('System error : ', err);
//     res.status(500).json(
//       Response({
//         success: false,
//         message: `${err}`,
//       })
//     );
//   }
// };

// const signup = async (req, res, next) => {
//   try {
//     //****check user if user exits*/
//     const response = await fetchUserByEmailOrID(req.body.email, false);
//     console.log(Array.isArray(response))
//     //****Check if user exits */
//     if (Array.isArray(response) === false) {
//       let connection;
//       connection = await getConnectionPool().getConnection();
//       const { user_type, first_name, phone_number, email, password } = matchedData(req);

//       const saltRounds = 10;
//       //** Hash the password
//       const hashPassword = await bcrypt.hash(password, saltRounds);
//       console.log("here");
//        //**Send otp */
//        const sendOTP = await signupOTP(req);

//        if (sendOTP === true) {
//         //**Store user data in the database
//       const [result] = await connection.execute(
//         "INSERT INTO `users` (`first_name`,`phone_number`,`email`,`user_type`,`password`, `created_at`) VALUES (?,?,?,?,?,?)",
//         [first_name, phone_number, email, user_type, hashPassword,new Date()]
//       );

//       //*****close connection after query execution */
//       connection.release();

//       if (result.affectedRows === 1) {
//         // //*** Generating Access and Refresh Token
//         const access_token = generateToken({ id: result.insertId });

//         const payload = {
//           access_token: access_token,
//         };

//         // //******keep email in locals */
//         // res.locals.email = email ;
//         res.status(201).json(
//           Response({
//             success: true,
//             message: "You have been successfully registered",
//             data: payload,
//           })
//         );
//       } else {
//         logger("user_signup").error('Failed, something went wrong : ',  result)
//         res.status(422).json(
//           Response({
//             success: false,
//             message: "Failed, something went wrong",
//           })
//         );
//       }
//        }
//        else{
//         {
//           logger("user_signup").error('Failed, OTP not sent : ',  result)
//           res.status(422).json(
//             Response({
//               success: false,
//               message: "Failed, something went wrong",
//             })
//           );
//         }
//        }
//     } else {
//       logger("user_signup").error('Failed Email already exists for : ',  email)
//       res.status(422).json(
//         Response({
//           success: false,
//           message: "Email Already Exits",
//         })
//       );
//     }
//   } catch (err) {
//     logger("user_signup").error('System error : ',  err)
//     res.status(500).json(
//       Response({
//         success: false,
//         message: `Ooops : ${err.message}`,
//       })
//     );
//   }
// };

module.exports = { login, signup };
