const {getConnectionPool,closeConnectionPool}  = require("../../db/connection.js");
const { generateToken, verifyToken } = require("../../utils/tokenHandler.js");
const bcrypt = require("bcrypt");
const { createHash } = require("crypto");
const { validationResult, matchedData } = require("express-validator");
const Response = require("../../utils/standardResponse.js");
const { fetchUserByEmailOrID } = require("../../models/userModel.js");
const { signupOTP } = require("./otpController.js");
const logger = require ('../../utils/logger.js');
const executeQuery = require("../../db/serverless_connection.js");

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
    const { email, password } = req.body;
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

      //******check if user is verified */
      if (response[0].verified === 0) {
       return res.status(422).json(
          Response({
            success: false,
            message: "User not verified !",
          })
        );
      }

      //*** Generating Access and Refresh Token
      const access_token = generateToken({ id: response[0].id });
      const userDetails = await executeQuery({
        query: `SELECT * FROM user_details_view WHERE user_details_view.email = ?`,
        values: [email],
      });

      const payload = {
        user: userDetails[0],
        access_token: access_token,
      };

      //*******save email in locals */
      res.locals.email = email;
      res.status(200).json(
        Response({
          success: true,
          message: "User Found",
          data: payload,
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
  } catch (err) {
    logger("user_login").error('System error : ',  err)
    res.status(500).json(
      Response({
        success: false,
        message: err,
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
      return res.status(422).json(
        Response({
          success: false,
          message: "Email Already Exists",
        })
      );
    }

    let connection;
    try {
      connection = await getConnectionPool().getConnection();
      const { user_type, first_name, phone_number, email, password } = matchedData(req);

      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
      
      const sendOTP = await signupOTP(req);

      if (sendOTP === true) {
        const [result] = await connection.execute(
          "INSERT INTO `users` (`first_name`,`phone_number`,`email`,`user_type`,`password`, `created_at`) VALUES (?,?,?,?,?,?)",
          [first_name, phone_number, email, user_type, hashPassword, new Date()]
        );

        if (result.affectedRows === 1) {
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
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } catch (err) {
    logger("user_signup").error('System error : ', err);
    res.status(500).json(
      Response({
        success: false,
        message: `Ooops : ${err.message}`,
      })
    );
  }
};

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
