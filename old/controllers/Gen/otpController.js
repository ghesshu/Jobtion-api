const executeQuery = require("../../db/serverless_connection.js");
const { validationResult, matchedData } = require("express-validator");
const Response = require("../../utils/standardResponse.js");
const { Email, SMS } = require("../../middlewares/notificationMiddleware.js");
const logger = require("../../utils/logger.js");

const signupOTP = async (req, res) => {
  try {
    //*****generate otp & message & expiryTime */
    const otp = Math.floor(100000 + Math.random() * 900000);
    let message = `Your OTP code ${otp}. This code lasts for 5min`;

    const { email, phone_number } = req.body;

      //*****Check of user otp already exits */
      const checkUserOTP = await executeQuery({
        query: `SELECT email, phone_number FROM o_t_p_s WHERE email = ? OR phone_number = ?`,
        values: [email, phone_number],
      });

      if (checkUserOTP.length > 0) {
        //*****delete & recreate */
        const deleteUserOTP = await executeQuery({
          query: `DELETE FROM o_t_p_s WHERE email = ? Or phone_number = ?`,
          values: [email, phone_number],
        });

        if (deleteUserOTP.affectedRows > 0) {
          //*****Store otp */
          const storeUserOTP = await executeQuery({
            query: `INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)`,
            values: [
              email,
              phone_number,
              otp,
              new Date(),
              new Date(),
              new Date(),
            ],
          });

          if (storeUserOTP.affectedRows > 0) {
            //*****send otp */
            Email(email, message);
            SMS(phone_number, message);

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
        const storeUserOTP = await executeQuery({
          query: `INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)`,
          values: [
            email,
            phone_number,
            otp,
            new Date(),
            new Date(),
            new Date(),
          ],
        });

        if (storeUserOTP.affectedRows > 0) {
          //*****send otp */
          Email(email, message);
          SMS(phone_number, message);

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

    const { email, phone_number } = req.body;

    //******check user */
    const checkUser = await executeQuery({
      query: `SELECT email, phone_number FROM users WHERE email = ? Or phone_number = ?`,
      values: [email, phone_number],
    });

    if (checkUser.length > 0) {
      //*****Check of user otp already exits */
      const checkUserOTP = await executeQuery({
        query: `SELECT email, phone_number FROM o_t_p_s WHERE email = ? OR phone_number = ?`,
        values: [email, phone_number],
      });

      if (checkUserOTP.length > 0) {
        //*****delete & recreate */
        const deleteUserOTP = await executeQuery({
          query: `DELETE FROM o_t_p_s WHERE email = ? Or phone_number = ?`,
          values: [email, phone_number],
        });

        if (deleteUserOTP.affectedRows > 0) {
          //*****Store otp */
          const storeUserOTP = await executeQuery({
            query: `INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)`,
            values: [
              email,
              phone_number,
              otp,
              new Date(),
              new Date(),
              new Date(),
            ],
          });

          if (storeUserOTP.affectedRows > 0) {
            //*****send otp */
            Email(email, message);
            SMS(phone_number, message);

            // return true;
            res.status(200).json(
              Response({
                success: true,
                message: "Code sent",
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
        const storeUserOTP = await executeQuery({
          query: `INSERT INTO o_t_p_s (email,phone_number,otp_code,otp_expiry,created_at,updated_at) VALUES(?,?,?,?,?,?)`,
          values: [
            email,
            phone_number,
            otp,
            new Date(),
            new Date(),
            new Date(),
          ],
        });

        if (storeUserOTP.affectedRows > 0) {
          //*****send otp */
          Email(email, message);
          SMS(phone_number, message);

          // return true;

          res.status(200).json(
            Response({
              success: true,
              message: "Code sent",
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
      logger("otp").error("No User Found For  : ", email);
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
        message: `System Error`,
      })
    );
  }
};

const verify = async (req, res) => {
  try {
    const currentTime = new Date();
    const { phone_number, code } = req.body;

    //*****Check of user otp already exits */
    const checkUserOTP = await executeQuery({
      query: `SELECT * FROM o_t_p_s WHERE phone_number = ?`,
      values: [phone_number],
    });

    const expirationTime = new Date(
      checkUserOTP[0]["created_at"].getTime() + 5 * 60000
    );

    if (checkUserOTP.length > 0) {
      if (checkUserOTP[0]["otp_code"] === code) {
        if (currentTime <= expirationTime) {
          //******update user verification to 1 */
          const verifyUser = await executeQuery({
            query: `UPDATE users SET verified = ? WHERE phone_number = ?`,
            values: [1, phone_number],
          });

          if (verifyUser.affectedRows > 0) {
            res.status(200).json(
              Response({
                success: true,
                message: "Verified",
              })
            );
          } else {
            res.status(422).json(
              Response({
                success: false,
                message: "Verification failed, please try again !",
              })
            );
          }
        } else {
          logger("otp").error("Code Expired For   : ", {
            "phone ": phone_number,
            "OTP Code ": code,
          });
          res.status(422).json(
            Response({
              success: false,
              message: "Code Expired",
            })
          );
        }
      } else {
        logger("otp").error("Invalid Code For   : ", {
          "phone ": phone_number,
          "OTP Code ": code,
        });
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

module.exports = { generate, verify, signupOTP };
