const db = require('../../db/connection_new.js');
const { generateToken, verifyToken } = require("../../utils/tokenHandler.js");
const bcrypt = require("bcrypt");
const { createHash } = require("crypto");
const { validationResult, matchedData } = require("express-validator");
const Response = require("../../utils/standardResponse.js");
const { fetchUserByEmailOrID } = require("../../models/userModel.js");
const { signupOTP, verify, otp_generate  } = require("./otpController.js");
const logger = require ('../../utils/logger.js');
const { getLoginDetails, getAdminDetails } = require("../../middlewares/userMiddleware");
const { Email } = require('../../middlewares/notificationMiddleware.js');
const { getRole } = require('../../middlewares/roleMiddleware.js');

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
      res.locals.full_name = response[0].first_name + " " + response[0].last_name;
      res.locals.user_id = {"id":response[0].id};
      res.locals.tokens = access_token;

    //   const user = await getLoginDetails(req,res);
    let user;

    //   if(response[0].user_type == "Admin" || response[0].user_type === "admin"){
    //     user = await getAdminDetails(req,res);
    //   }
    //   else{
        user = await getLoginDetails(req,res);
    //   }

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

          //send email
          Email(req.body.email,"Registration Successful");
                    
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

const singleSignOn = async (req, res, next) => {
  try {
    const { email, fcm_token } = req.body;

    const fb_token = fcm_token === undefined ? "null" : fcm_token;

    //****check users if user exits*/
    const response = await fetchUserByEmailOrID(email, false);

    if (response.length > 0) {
      // const verifyPassword = await bcrypt.compare(
      //   email+1,
      //   response[0].password
      // );

      // if (!verifyPassword) {
      //   logger("user_login").error('Wrong Password : ',  email)
      //   return res.status(401).send(
      //     Response({
      //       success: false,
      //       message: "Incorrect password !",
      //     })
      //   );
      // }

      //*** Generating Access and Refresh Token
      const access_token = generateToken({ id: response[0].id });

      const payload = {
        access_token: access_token,
      };


      console.log("res : ", res.locals);

      // const user = await getLoginDetails(req,res);

      //***update the fcm_token */
      await db.query("UPDATE users SET fcm_token = ? WHERE email = ?", [fb_token,email])

      res.status(200).json(
        Response({
          success: true,
          message: "User Found",
          data: payload,
        })
      );
    } 
    else {
      //*******Sign the user up */
      const { user_type, first_name, phone_number, email, fcm_token } = req.body;

      const password = email + 1;

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

          //send email
          Email(req.body.email,"Registration Successful");
                    
          res.status(201).json(
            Response({
              success: true,
              message: "You have been successfully registered",
              data: payload,
            })
          );
        } else {
          logger("user_signup").error('Failed, something went wrong : ',  result);
          res.status(417).json(
            Response({
              success: false,
              message: "Failed, something went wrong",
            })
          );
        }
      } else {
        logger("user_signup").error('Failed, OTP not sent');
        res.status(417).json(
          Response({
            success: false,
            message: "Failed, something went wrong",
          })
        );
      }
      // logger("user_login").error('Wrong Credentials : ',  email,password)
      // res.status(404).json(
      //   Response({
      //     success: false,
      //     message: "Wrong Email or Password",
      //   })
      // );
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

const reLogin = async (req, res, token) => {
  try {
    const { email, fcm_token } = req.body;

    const fb_token = fcm_token === undefined ? "null" : fcm_token;

    //****check users if user exits*/
    const response = await fetchUserByEmailOrID(email, false);

    if (response.length > 0) {

      //*** Generating Access and Refresh Token
      const access_token = generateToken({ id: response[0].id });

      const payload = {
        access_token: access_token,
      };


      console.log("new token : ", response[0].id );

      // const user = await getLoginDetails(req,res);

      //***update the fcm_token */
      await db.query("UPDATE users SET fcm_token = ? WHERE email = ?", [fb_token,email])
      
      //****end the current session */
      if(token !== response[0].id){
        console.log("delete token : ", token)
        await db.query("DELETE FROM users WHERE id = ? ", [token])
      }
      

      res.status(200).json(
        Response({
          success: true,
          message: "User Found",
          data: payload,
        })
      );
    }
    else{
      const payload = {
        access_token: "",
      };
      res.status(200).json(
        Response({
          success: true,
          message: "User Not Found",
          data: payload,
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

// const singleSignOn = async (req, res, next) => {
//   try {
//     const { email, fcm_token } = req.body;

//     const fb_token = fcm_token === undefined ? "null" : fcm_token;

//     //****check users if user exits*/
//     const response = await fetchUserByEmailOrID(email, false);

//     if (response.length > 0) {
//     //   const verifyPassword = await bcrypt.compare(
//     //     email+1,
//     //     response[0].password
//     //   );

//     //   if (!verifyPassword) {
//     //     logger("user_login").error('Wrong Password : ',  email)
//     //     return res.status(401).send(
//     //       Response({
//     //         success: false,
//     //         message: "Incorrect password !",
//     //       })
//     //     );
//       }

//       //*** Generating Access and Refresh Token
//       const access_token = generateToken({ id: response[0].id });

//       const payload = {
//         access_token: access_token,
//       };


//       console.log("res : ", res.locals);

//       // const user = await getLoginDetails(req,res);

//       //***update the fcm_token */
//       await db.query("UPDATE users SET fcm_token = ? WHERE email = ?", [fb_token,email])

//       res.status(200).json(
//         Response({
//           success: true,
//           message: "User Found",
//           data: payload,
//         })
//       );
//     } 
//     else {
//       //*******Sign the user up */
//       const { user_type, first_name, phone_number, email, fcm_token } = matchedData(req);

//       const password = email + 1;

//       const fb_token = fcm_token === undefined ? "null" : fcm_token;

//       const saltRounds = 10;

//       const hashPassword = await bcrypt.hash(password, saltRounds);
      
//       const sendOTP = await signupOTP(req);

//       // const sendOTP = true

//       if (sendOTP === true) {
//         const sql = "INSERT INTO `users` (`first_name`,`phone_number`,`email`,`user_type`,`password`, `fcm_token`,`created_at`) VALUES (?,?,?,?,?,?,?)";
//         const values = [first_name, phone_number, email, user_type, hashPassword, fb_token, new Date()];
      
//         const result = await db.query(sql, values);

//         if (result.affectedRows === 1) {
//           //*******create preference with the user's id */
//           await db.query("INSERT INTO preferences(user_id) VALUES(?)", [result.insertId])

//           //*****create a job type with the user's id */
//           await db.query("INSERT INTO job_types(user_id) VALUES(?)", [result.insertId])

//           const access_token = generateToken({ id: result.insertId });

//           const payload = {
//             access_token: access_token,
//           };

//           //send email
//           Email(req.body.email,"Registration Successful");
                    
//           res.status(201).json(
//             Response({
//               success: true,
//               message: "You have been successfully registered",
//               data: payload,
//             })
//           );
//         } else {
//           logger("user_signup").error('Failed, something went wrong : ',  result);
//           res.status(417).json(
//             Response({
//               success: false,
//               message: "Failed, something went wrong",
//             })
//           );
//         }
//       } else {
//         logger("user_signup").error('Failed, OTP not sent');
//         res.status(417).json(
//           Response({
//             success: false,
//             message: "Failed, something went wrong",
//           })
//         );
//       }
//       // logger("user_login").error('Wrong Credentials : ',  email,password)
//       // res.status(404).json(
//       //   Response({
//       //     success: false,
//       //     message: "Wrong Email or Password",
//       //   })
//       // );
//     }
    
//   } catch (error) {
//     logger("user_login").error('System error : ',  error)
//     console.error(error)
//     res.status(500).json(
//       Response({
//         success: false,
//         message: `${error}`,
//       })
//     );
//   }
// };

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirm_password } = req.body;

    console.log(req.body);

    //**verify OTP first */
    const verifyOTP = await verify(req, res, "forgetPassword");

    if (verifyOTP) {
      // console.log("req.body : ", req.body);

    //****check users if user exits*/
    const response = await fetchUserByEmailOrID(email, false);

    if (response.length > 0) {

      const verifyPassword = confirm_password === password;

      if (!verifyPassword) {
        logger("user_login").error('Passwords do not match : ',  email)
        return res.status(400).send(
          Response({
            success: false,
            message: "Passwords do not match!",
          })
        );
      }

      const saltRounds = 10;

      const hashPassword = await bcrypt.hash(password, saltRounds);

      //***update the password */
      await db.query("UPDATE users SET password = ? WHERE email = ?", [hashPassword,email])

      //***send an email saying the password has been reset */
      const message = `Hi ${response[0].first_name}, <p>Your password reset was successful.</p>`
      Email(email, message);

      res.status(200).json(
        Response({
          success: true,
          message: "Password Updated",
        })
      );
    } else {
      logger("user_login").error('Wrong Credentials : ',  email,password)
      res.status(200).json(
        Response({
          success: true,
          message: "If user exists, then password have been updated",
        })
      );
    }
    }
    else{
      console.log("on else test verification : ",verifyOTP)
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

const forgottenPassword = async(req, res, next) => {
  try {
      //****check users if user exits*/
    const response = await fetchUserByEmailOrID(req.body.email, false);

    if (response.length > 0) {

      const sendOTP = await otp_generate(req,res);

      if (sendOTP === true) {

      res.status(200).json(
        Response({
          success: true,
          message: "An OTP code have been sent to reset your password",
        })
      );
    }
    } else {
      logger("forget_password").error('Wrong Credentials : ',  req.body.email)
      res.status(200).json(
        Response({
          success: true,
          message: "If user exists, please check the email for otp code",
        })
      );
    }

  } catch (error) {
    logger("forget_password").error('System error : ',  error)
    console.error(error)
    // res.status(500).json(
    //   Response({
    //     success: false,
    //     message: `${error}`,
    //   })
    // );
  }
}

const createAdmin = async (req, res, next) => {
  try {
    const response = await db.query("SELECT * FROM admin_users WHERE email = ?", [
      req.body.email,
    ]);

    if (Array.isArray(response) && response.length > 0) {
      logger("admin_add_role").error(
        "Failed: Admin already exists for:",
        req.body.email
      );
      return res.status(409).json(
        Response({
          success: false,
          message: "Admin Already Exists",
        })
      );
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

      const user_role = await db.query("SELECT * FROM roles WHERE id = ?", [
        req.body.role_id,
      ]);
      
      if(!!user_role === false){
          return res.status(404).send(
          Response({
            success: false,
            message: "Role Not found",
          })
        );
      }

    const sql = `INSERT INTO admin_users (username, full_name, email, password, role_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [req.body.username, req.body.full_name, req.body.email, hashPassword, req.body.role_id];

    const result = await db.query(sql, values);

    const access_token = generateToken({ id: result.insertId });
          const payload = {
            access_token: access_token,
          };

    if (result.affectedRows > 0) {
      res.status(201).json(
        Response({
          success: true,
          message: "Admin Created Successfully",
          data: payload
        })
      );
    } else {
      res.status(400).json(
        Response({
          success: false,
          message: "Failed to create admin",
        })
      );
    }
  } catch (error) {
    logger("admin_add_role").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
}

const authenticate = async (req, res, next) => {
  try {
    const response_ = await db.query("SELECT password FROM admin_users WHERE email = ?", [
      req.body.email,
    ]);

    if (Array.isArray(response_) && response_.length > 0) {
      const verifyPassword = await bcrypt.compare(
        req.body.password,
        response_[0].password
      );

      if (!verifyPassword) {
        logger("admin_authenticate").error('Wrong Password : ',  req.body.email)
        return res.status(400).send(
          Response({
            success: false,
            message: "Incorrect password !",
          })
        );
      }

      const response = await db.query("SELECT id,username,full_name,email,role_id FROM admin_users WHERE email = ?", [
        req.body.email,
      ]);

      const user_role = await db.query("SELECT * FROM roles WHERE id = ?", [
        response[0].role_id,
      ]);
      
      if(!!user_role === false){
          return res.status(404).send(
          Response({
            success: false,
            message: "Role Not found",
          })
        );
      }
      else{
          const access_token = generateToken({ id: response[0].id });
      const access = await getRole(response[0].role_id, res);
      const payload = {
        admin_details: response[0],
        access: access,
        access_token: access_token,
      };

      res.status(200).json(
        Response({
          success: true,
          message: "Admin Authenticated Successfully",
          data: payload
        })
      );
      }

      
    } else {
      logger("admin_authenticate").error('Wrong Credentials : ',  req.body.email)
      res.status(404).json(
        Response({
          success: false,
          message: "Wrong Email or Password",
        })
      );
    }
  } catch (error) {
    logger("admin_authenticate").error('System error : ',  error)
    console.error(error)
    res.status(500).json(
      Response({
        success: false,
        message: `${error}`,
      })
    );
  }
};

const updateAdmin = async (req, res) => {
  try {
    const adminId = req.body.id;
    const { username, full_name, email, password, role_id } = req.body;

    

    // Check if admin exists
    const existingAdmin = await db.query("SELECT * FROM admin_users WHERE id = ?", [adminId]);
    if (!existingAdmin || existingAdmin.length === 0) {
      logger("admin_update").error("Admin not found for ID:", adminId);
      return res.status(404).json(
        Response({
          success: false,
          message: "Admin not found",
        })
      );
    }

    // Check if the new email already exists for another admin
    if (email) {
      const emailCheck = await db.query("SELECT id FROM admin_users WHERE email = ? AND id != ?", [email, adminId]);
      if (emailCheck && emailCheck.length > 0) {
        logger("admin_update").error("Email already exists for another admin:", email);
        return res.status(409).json(
          Response({
            success: false,
            message: "Email already in use by another admin",
          })
        );
      }
    }

    // Check if role_id exists
    if (role_id) {
        const user_role = await db.query("SELECT * FROM roles WHERE id = ?", [
            role_id,
        ]);
        if(user_role.length === 0){
            logger("admin_update").error("Role not found for ID:", role_id);
            return res.status(404).send(
            Response({
                success: false,
                message: "Role Not found",
            })
            );
        }
    }

    // Build the update query dynamically
    let sql = "UPDATE admin_users SET ";
    const values = [];
    const updates = [];

    if (username) {
      updates.push("username = ?");
      values.push(username);
    }
    if (full_name) {
      updates.push("full_name = ?");
      values.push(full_name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (password) {
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
      updates.push("password = ?");
      values.push(hashPassword);
    }
    if (role_id) {
      updates.push("role_id = ?");
      values.push(role_id);
    }

    if (updates.length === 0) {
      return res.status(400).json(
        Response({
          success: false,
          message: "No update fields provided",
        })
      );
    }

    sql += updates.join(", ") + " WHERE id = ?";
    values.push(adminId);

    const result = await db.query(sql, values);

    if (result.affectedRows > 0) {
      res.status(200).json(
        Response({
          success: true,
          message: "Admin Updated Successfully",
        })
      );
    } else {
      // This case might happen if the ID exists but no rows were changed (e.g., same data sent)
      // Or if the ID didn't exist (already handled above, but good practice to check)
      logger("admin_update").warn("Admin update did not affect any rows for ID:", adminId);
      res.status(400).json(
        Response({
          success: false,
          message: "Failed to update admin or no changes detected",
        })
      );
    }
  } catch (error) {
    logger("admin_update").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
};

module.exports = { login, signup, singleSignOn, reLogin, resetPassword, forgottenPassword, createAdmin, authenticate, updateAdmin };
