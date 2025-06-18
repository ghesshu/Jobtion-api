const db = require('../../db/connection_new.js');
const Response = require("../../utils/standardResponse.js");
const { Email, SMS, UKSmS } = require("../../middlewares/notificationMiddleware.js");
const logger = require("../../utils/logger.js");


const signupOTP = async (req, res) => {
  try {
    //*****generate otp & message & expiryTime */
    const otp = Math.floor(100000 + Math.random() * 900000);
    let message = `Your OTP code ${otp}. This code lasts for 5min`;

    const { email, phone_number } = req.body;

    //*****Check of user otp already exits */
    const checkUserOTP = await db.query("SELECT email, phone_number FROM o_t_p_s WHERE email = ? AND phone_number = ?",[email, phone_number]);

    if (checkUserOTP.length > 0) {
      //*****delete & recreate */
      const deleteUserOTP = await db.query("DELETE FROM o_t_p_s WHERE email = ? Or phone_number = ?",[checkUserOTP[0].email, checkUserOTP[0].phone_number]);

      if (deleteUserOTP.affectedRows > 0) {
        //*****Store otp */
        const storeUserOTP = await db.query("INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)",[
            checkUserOTP[0].email,
            checkUserOTP[0].phone_number,
            otp,
            new Date(),
            new Date(),
            new Date(),
          ],
        );

        if (storeUserOTP.affectedRows > 0) {
          //*****send otp */
          Email(checkUserOTP[0].email, message);
          SMS(checkUserOTP[0].phone_number, message);


          // console.log(checkUserOTP);

          return true;
          // res.status(200).json(
          //   Response({
          //     success: true,
          //     message: "Code sent",
          //   })
          // );
        } else {
          logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
          return false;
          // res.status(422).json(
          //   Response({
          //     success: false,
          //     message: "Failed to generate otp code",
          //   })
          // );
        }
      }
    } else {
      //*****Store otp */
      const storeUserOTP = await db.query("INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)",[
          email,
          phone_number,
          otp,
          new Date(),
          new Date(),
          new Date(),
        ],
      );

      if (storeUserOTP.affectedRows > 0) {
        //*****send otp */
        Email(email, message);
        SMS(phone_number, message);

        return true;

      } else {
        logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
        return false;
      }
    }
  } catch (error) {
    res.status(500).json(
      Response({
        success: false,
        message: `System Error`,
      })
    );
  }
};

const generate = async (req, res) => {
  try {
    //*****generate otp & message & expiryTime */
    const otp = Math.floor(100000 + Math.random() * 900000);
    let message = `Your OTP code ${otp}. This code lasts for 5min`;

    const { phone_number } = req.body;

    //******check user */
    const checkUser = await db.query("SELECT email, phone_number FROM users WHERE id = ?",[res.locals.user_id.id]);

    if (checkUser.length > 0) {
      //*****Check of user otp already exits */
      const checkUserOTP = await db.query("SELECT email, phone_number FROM o_t_p_s WHERE email = ? AND phone_number = ?",[checkUser[0].email, checkUser[0].phone_number]);

      if (checkUserOTP.length > 0) {
        //*****delete & recreate */
        const deleteUserOTP = await db.query("DELETE FROM o_t_p_s WHERE email = ? AND phone_number = ?",[checkUser[0].email, checkUser[0].phone_number]);

        if (deleteUserOTP.affectedRows > 0) {
          //*****Store otp */
          const storeUserOTP = await db.query("INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)",
            [
              checkUser[0].email,
              checkUser[0].phone_number,
              otp,
              new Date(),
              new Date(),
              new Date(),
            ],
          );

          if (storeUserOTP.affectedRows > 0) {
            //*****send otp */
            Email(checkUser[0].email, message);
            SMS(checkUser[0].phone_number, message);
            // UKSmS(checkUser[0].phone_number, message);

            // return true;
            res.status(200).json(
              Response({
                success: true,
                message: `Code sent to both phone number : ${checkUser[0].phone_number} with email : ${checkUser[0].email}`,
              })
            );
          } else {
            logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
            // return false;
            res.status(422).json(
              Response({
                success: false,
                message: "Failed to generate otp code",
              })
            );
          }
        }
        else{
          logger("otp").error("Failed to generate otp for  : ", deleteUserOTP);
          res.status(422).json(
            Response({
              success: false,
              message: `Cannot generate OTP code, please try again`,
            })
          );
        }
      } else {
        //*****Store otp */
        const storeUserOTP = await db.query(`INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)`,
           [
            checkUser[0].email,
            checkUser[0].phone_number,
            otp,
            new Date(),
            new Date(),
            new Date(),
          ],
        );

        if (storeUserOTP.affectedRows > 0) {
          //*****send otp */
          Email(checkUser[0].email, message);
          SMS(checkUser[0].phone_number, message);
          // UKSmS(checkUser[0].phone_number, message);

          // return true;

          res.status(200).json(
            Response({
              success: true,
              message: `Code sent to both phone number : ${checkUser[0].phone_number} with email : ${checkUser[0].email}`,
            })
          );
        } else {
          logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
          // return false;
          res.status(422).json(
            Response({
              success: false,
              message: "Failed to generate otp code",
            })
          );
        }
      }
    } else {
      console.log(res.locals.user_id.id)
      logger("otp").error("No User Found For  user ID : ", res.locals.user_id.id);
      // return false;
      res.status(422).json(
        Response({
          success: false,
          message: "No User Found",
        })
      );
    }
  } catch (error) {
    res.status(500).json(
      Response({
        success: false,
        message: `${error}`,
      })
    );
  }
};

// const verify = async (req, res) => {
//   try {
//     const currentTime = new Date();
//     const { phone_number, code } = req.body;


//     logger("otp_verification").info("user token   : ", res.locals.user_id);

//     //******select user details */
//     const user = await db.query("SELECT email,phone_number FROM users WHERE id = ?", [res.locals.user_id.id]);

//     if (user.length > 0) {
//       //*****Check of user otp already exits */
//       const checkUserOTP = await db.query("SELECT * FROM o_t_p_s WHERE email = ? AND phone_number = ?", [user[0].email,user[0].phone_number]);

//       if (checkUserOTP.length > 0) {
//         logger("otp_verification").info("user exits in otp table  : ", checkUserOTP);

//         const expirationTime = new Date(
//           checkUserOTP[0]["created_at"].getTime() + 5 * 60000
//         );

//         if (checkUserOTP[0]["otp_code"] === code) {
//           if (currentTime <= expirationTime) {
//             //******update user verification to 1 */
//             const verifyUser = await db.query(`UPDATE users SET verified = ? WHERE email = ?`, [1, user[0].email]);

//             if (verifyUser.affectedRows > 0) {
//               res.status(200).json(
//                 Response({
//                   success: true,
//                   message: "Verified",
//                 })
//               );
//             } else {
//               res.status(422).json(
//                 Response({
//                   success: false,
//                   message: "Verification failed, please try again !",
//                 })
//               );
//             }
//           } else {
//             // logger("otp").error("Code Expired For   : ", {
//             //   "phone ": phone_number,
//             //   "OTP Code ": code,
//             // });
//             res.status(422).json(
//               Response({
//                 success: false,
//                 message: "Code Expired",
//               })
//             );
//           }
//         } else {
//           // logger("otp").error("Invalid Code For   : ", {
//           //   "phone ": phone_number,
//           //   "OTP Code ": code,
//           // });
//           res.status(422).json(
//             Response({
//               success: false,
//               message: "Invalid Code",
//             })
//           );
//         }
//       } else {
//         res.status(422).json(
//           Response({
//             success: false,
//             message: "No Code Found",
//           })
//         );
//       }
//     } else {
//       res.status(422).json(
//         Response({
//           success: false,
//           message: "No User Found",
//         })
//       );
//     }
//   } catch (error) {
//     logger("otp").error("System Error   : ", res);
//     res.status(500).json(
//       Response({
//         success: false,
//         message: "System Error",
//       })
//     );
//   }
// };

const otp_generate = async (req, res) => {
  try {
    //*****generate otp & message & expiryTime */
    const otp = Math.floor(100000 + Math.random() * 900000);
    let message = `Your OTP code ${otp}. This code lasts for 5min`;

    const { email } = req.body;

    //******check user */
    const checkUser = await db.query("SELECT email, phone_number FROM users WHERE email = ?",[email]);

    console.log(checkUser);

    if (checkUser.length > 0) {
      //*****Check of user otp already exits */
      const checkUserOTP = await db.query("SELECT email, phone_number FROM o_t_p_s WHERE email = ? AND phone_number = ?",[checkUser[0].email, checkUser[0].phone_number]);

      if (checkUserOTP.length > 0) {
        //*****delete & recreate */
        const deleteUserOTP = await db.query("DELETE FROM o_t_p_s WHERE email = ? AND phone_number = ?",[checkUser[0].email, checkUser[0].phone_number]);

        if (deleteUserOTP.affectedRows > 0) {
          //*****Store otp */
          const storeUserOTP = await db.query("INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)",
            [
              checkUser[0].email,
              checkUser[0].phone_number,
              otp,
              new Date(),
              new Date(),
              new Date(),
            ],
          );

          if (storeUserOTP.affectedRows > 0) {
            //*****send otp */
            Email(checkUser[0].email, message);
            // SMS(checkUser[0].phone_number, message);
            // UKSmS(checkUser[0].phone_number, message);

            // return true;
            res.status(200).json(
              Response({
                success: true,
                message: `Verify code sent to : ${checkUser[0].email}`,
              })
            );
          } else {
            logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
            // return false;
            res.status(422).json(
              Response({
                success: false,
                message: "Failed to generate otp code",
              })
            );
          }
        }
        else{
          logger("otp").error("Failed to generate otp for  : ", deleteUserOTP);
          res.status(422).json(
            Response({
              success: false,
              message: `Cannot generate OTP code, please try again`,
            })
          );
        }
      } else {
        //*****Store otp */
        const storeUserOTP = await db.query(`INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)`,
           [
            checkUser[0].email,
            checkUser[0].phone_number,
            otp,
            new Date(),
            new Date(),
            new Date(),
          ],
        );

        if (storeUserOTP.affectedRows > 0) {
          //*****send otp */
          Email(checkUser[0].email, message);
          // SMS(checkUser[0].phone_number, message);
          // UKSmS(checkUser[0].phone_number, message);

          // return true;

          res.status(200).json(
            Response({
              success: true,
              message: `Verify code sent to : ${checkUser[0].email}`,
            })
          );
        } else {
          logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
          // return false;
          res.status(422).json(
            Response({
              success: false,
              message: "Failed to generate otp code",
            })
          );
        }
      }
    } else {
      logger("otp").error("No User Found For  user ID : ", email);
      // return false;
      res.status(422).json(
        Response({
          success: false,
          message: "No User Found",
        })
      );
    }
  } catch (error) {
    res.status(500).json(
      Response({
        success: false,
        message: `${error}`,
      })
    );
  }
};

const modifyOTP = async (req, res) => {
  try {
    //*****generate otp & message & expiryTime */
    const otp = Math.floor(100000 + Math.random() * 900000);
    let message = `Your OTP code ${otp}. This code lasts for 5min`;
    
    const { email } = req.body;

    //*****Check of user otp already exits */
    const checkUserOTP = await db.query("SELECT email, phone_number FROM o_t_p_s WHERE email = ?",[email]);

    if (checkUserOTP.length > 0) {
      //*****delete & recreate */
      const deleteUserOTP = await db.query("DELETE FROM o_t_p_s WHERE email = ? ",[checkUserOTP[0].email]);

      if (deleteUserOTP.affectedRows > 0) {
        //*****Store otp */
        const storeUserOTP = await db.query("INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)",[
            checkUserOTP[0].email,
            '0000000000',
            otp,
            new Date(),
            new Date(),
            new Date(),
          ],
        );

        if (storeUserOTP.affectedRows > 0) {
          //*****send otp */
          Email(checkUserOTP[0].email, message, 'Verification Code');
          //SMS(checkUserOTP[0].phone_number, message);


          // console.log(checkUserOTP);

          // return true;
          res.status(200).json(
            Response({
              success: true,
              message: `Code sent to email : ${email}`,
            })
          );
        } else {
          logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
          // return false;
          res.status(422).json(
            Response({
              success: false,
              message: "Failed to generate otp code",
            })
          );
        }
      }
    } else {
      //*****Store otp */
      const storeUserOTP = await db.query("INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)",[
          email,
          '0000000000',
          otp,
          new Date(),
          new Date(),
          new Date(),
        ],
      );

      if (storeUserOTP.affectedRows > 0) {
        //*****send otp */
        Email(email, message, 'Verification Code');
        //SMS(phone_number, message);

        res.status(200).json(
          Response({
            success: true,
            message: `Code sent to email : ${email}`,
          })
        );

      } else {
        logger("otp").error("Failed to generate otp for  : ", storeUserOTP);
        // return false;
          res.status(422).json(
            Response({
              success: false,
              message: "Failed to generate otp code",
            })
          );
      }
    }
  } catch (error) {
    res.status(500).json(
      Response({
        success: false,
        message: `System Error`,
      })
    );
  }
};

const verify = async (req, res, route) => {
  try {
    const currentTime = new Date();
    const { phone_number, code, email } = req.body;
    let user;


    if (route === 'forgetPassword') {
      //******select user details */
       user = await db.query("SELECT email,phone_number FROM users WHERE email = ?", [email]);
    }
    else{
      logger("otp_verification").info("user token   : ", res.locals.user_id);

    //******select user details */
       user = await db.query("SELECT email,phone_number FROM users WHERE id = ?", [res.locals.user_id.id]);
    }

    // console.log("user : ",user)
    if (user.length > 0) {
      //*****Check of user otp already exits */
      let checkUserOTP;
      if (route === 'modification') {
        console.log("here")
         checkUserOTP = await db.query("SELECT * FROM o_t_p_s WHERE email = ?", [email]);
      }
      else{
         checkUserOTP = await db.query("SELECT * FROM o_t_p_s WHERE email = ? AND phone_number = ?", [user[0].email,user[0].phone_number]);
      }
      

      if (checkUserOTP.length > 0) {
        logger("otp_verification").info("user exits in otp table  : ", checkUserOTP);

        const expirationTime = new Date(
          checkUserOTP[0]["created_at"].getTime() + 5 * 60000
        );

        if (checkUserOTP[0]["otp_code"] === code) {
          if (currentTime <= expirationTime) {
            //******update user verification to 1 */
            const verifyUser = await db.query(`UPDATE users SET verified = ? WHERE email = ?`, [1, user[0].email]);

            if (verifyUser.affectedRows > 0) {
              if (route === 'forgetPassword' || route === 'modification') {
                return true;
              }

              else{
                res.status(200).json(
                  Response({
                    success: true,
                    message: "Verified",
                  })
                );
              }
              
            } else {
              res.status(422).json(
                Response({
                  success: false,
                  message: "Verification failed, please try again !",
                })
              );
            }
          } else {
            // logger("otp").error("Code Expired For   : ", {
            //   "phone ": phone_number,
            //   "OTP Code ": code,
            // });
            res.status(422).json(
              Response({
                success: false,
                message: "Code Expired",
              })
            );
          }
        } else {
          // logger("otp").error("Invalid Code For   : ", {
          //   "phone ": phone_number,
          //   "OTP Code ": code,
          // });
          res.status(422).json(
            Response({
              success: false,
              message: "Invalid Code",
            })
          );
        }
      } else {
        res.status(422).json(
          Response({
            success: false,
            message: "No Code Found",
          })
        );
      }
    } else {
      res.status(422).json(
        Response({
          success: false,
          message: "No User Found",
        })
      );
    }
  } catch (error) {
    logger("otp").error("System Error   : ", res);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

module.exports = { generate, verify, signupOTP,otp_generate, modifyOTP };
