const {getConnectionPool,closeConnectionPool}  = require("../../db/connection.js");
const Response = require("../../utils/standardResponse.js");
const { getPathByFieldName } = require("../../utils/custom_function.js");
const logger = require ('../../utils/logger.js');
const executeQuery = require("../../db/serverless_connection.js");

const createUserProfile = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();
      
    //******get uploads files path */
    const { proof_of_address, profile_picture, identification } =
      getPathByFieldName(
        req.files,
        "proof_of_address",
        "profile_picture",
        "identification"
      );

    if (res.locals.user_type === "Clients") {
      //*****update the details of user */
      const [result] = await connection.execute(
        "UPDATE `users` SET `company_name` = ?, `first_name` = ?, `last_name` = ?, `address` = ?,  `crn` = ?, `urn` = ?, `about_me` = ?, `identification` = ? , `proof_of_address` = ?, `profile_picture` = ?, `lat` = ?, `lng` = ? WHERE id = ?",
        [
          req.body.company_name,
          req.body.first_name,
          req.body.last_name,
          req.body.address,
          req.body.crn,
          req.body.urn,
          req.body.about_me,
          identification,
          proof_of_address,
          profile_picture,
          req.body.lat,
          req.body.lng,
          res.locals.user_id.id,
        ]
      );

      if (result.affectedRows > 0) {
        console.log("done");
        res.status(201).json(
          Response({
            success: true,
            message: "Profile Created",
          })
        );
      } else {
        logger("create_user_profile").error('Bug : ', result)
        res.status(417).json(
          Response({
            success: false,
            message: "Bad request",
          })
        );
      }
    } else {
      //*****update the details of user */
      const [result] = await connection.execute(
        "UPDATE `users` SET `title` = ?, `pronouns` = ? , `first_name` = ?, `last_name` = ?, `address` = ?,  `dob` = ?, `gender` = ?, `about_me` = ?, `identification` = ? , `proof_of_address` = ?, `profile_picture` = ?, `lat` = ?, `lng` = ? WHERE id = ?",
        [
          req.body.title,
          req.body.pronouns,
          req.body.first_name,
          req.body.last_name,
          req.body.address,
          req.body.dob,
          req.body.gender,
          req.body.about_me,
          identification,
          proof_of_address,
          profile_picture,
          req.body.lat,
          req.body.lng,
          res.locals.user_id.id,
        ]
      );

      if (result.affectedRows > 0) {
        console.log("done");
        res.status(201).json(
          Response({
            success: true,
            message: "Profile Created",
          })
        );
      } else {
        logger("create_user_profile").error('Bug : ', result)
        res.status(417).json(
          Response({
            success: false,
            message: "Bad Request",
          })
        );
      }
    }
  } catch (error) {
    // console.log(error)
    logger("create_user_profile").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const updateUserProfile = async (req, res) => {
  try {
    //******get uploads files path */
    const {
      level_two,
      level_three,
      level_four_plus,
      certificate,
      dbs_certificate,
      resume_cv,
    } = getPathByFieldName(
      req.files,
      "level_two",
      "level_three",
      "level_four_plus",
      "certificate",
      "dbs_certificate",
      "resume_cv"
    );

    //*************Save the documents */
    const saveDocuments = await executeQuery({
      query: `INSERT INTO documents(user_id, level_two, level_three, level_four_plus, certificate, dbs_certificate, dbs_expiry_date, resume_cv, created_at) VALUES(?,?,?,?,?,?,?,?,?)`,
      values: [
        res.locals.user_id.id,
        level_two,
        level_three,
        level_four_plus,
        certificate,
        dbs_certificate,
        req.body.dbs_expiry_date,
        resume_cv,
        new Date(),
      ],
    });

    if (saveDocuments.affectedRows > 0) {
      //*******get all selected preference */
      const selectedPreference = req.body.preference || [];

      if (selectedPreference.length > 0) {
        const keyValuePairs = selectedPreference[0].split(',');
        for (const preference of keyValuePairs) {
          await executeQuery({
            query: `INSERT INTO preferences(user_id, preference, created_at) VALUES(?, ?,?)`,
            values: [res.locals.user_id.id, preference, new Date()],
          });
        }
      }

      //*******get all selected job types */
      const selectedJobTypes = req.body.job_types || [];

      if (selectedJobTypes.length > 0) {
        const keyValuePairs = selectedJobTypes[0].split(',');
        for (const job_type of keyValuePairs) {
          await executeQuery({
            query: `INSERT INTO job_types(user_id, type, created_at) VALUES(?, ?,?)`,
            values: [res.locals.user_id.id, job_type, new Date()],
          });
        }
      }

      //*******get all selected job preferred */
      const selectedJobPreferred = req.body.job_preferred || [];

      if (selectedJobPreferred.length > 0) {
        const keyValuePairs = selectedJobPreferred[0].split(',');
        for (const job_preferred of keyValuePairs) {
          await executeQuery({
            query: `INSERT INTO job_role_preferences(user_id, job_role, created_at) VALUES(?,?,?)`,
            values: [res.locals.user_id.id, job_preferred, new Date()],
          });
        }
      }

      res.status(200).json(
        Response({
          success: true,
          message: "Done",
        })
      );
    } else {
      res.status(422).json(
        Response({
          success: false,
          message: saveDocuments.error.sqlMessage,
        })
      );
    }
  } catch (error) {
    // console.log(error)
    res.status(500).json(
      Response({
        success: false,
        message: error,
      })
    );
  }
};

const getUserDetails = async (req, res) => {
  try {
    //********Get user user details */
    const userDetails = await executeQuery({
      query: `SELECT * FROM user_details_view WHERE user_details_view.email = ?`,
      values: [req.email],
    });

    //*******Get  Preferences*/
    const preference = await executeQuery({
      query: `SELECT preference FROM preferences WHERE user_id = ?`,
      values: [res.locals.user_id.id],
    });

    //*******Get  Job Type*/
    const jobType = await executeQuery({
      query: `SELECT type FROM job_types WHERE user_id = ?`,
      values: [res.locals.user_id.id],
    });

    //*******Get  Job Type*/
    const job_role_preferences = await executeQuery({
      query: `SELECT job_role FROM job_role_preferences WHERE user_id = ?`,
      values: [res.locals.user_id.id],
    });

    if (userDetails.length > 0) {
      const payload = {
        userDetails,
        preference,
        jobType,
        job_role_preferences
      };

      res.status(200).json(
        Response({
          success: true,
          message: "Details fetched",
          data: payload,
        })
      );
    } else {
      const error = userDetails.error.sqlMessage;
      logger("get_user_details").error('SQL Error : ',  {error})
      res.status(422).json(
        Response({
          success: false,
          message: userDetails.error.sqlMessage,
        })
      );
    }
  } catch (error) {
    logger("get_user_details").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: ` System error -  ${error.sqlMessage}`,
      })
    );
  }
};

const editUserDetails = async (req, res) => {
  try {
     //********Get user user details */
     const userDetails = await executeQuery({
      query: `SELECT * FROM user_details_view WHERE user_details_view.email = ?`,
      values: [req.email],
    });



    let { proof_of_address, profile_picture, identification } =
      getPathByFieldName(
        req.files,
        "proof_of_address",
        "profile_picture",
        "identification"
      );

      //******check if the documents path is empty and use the old one */
        if (proof_of_address === undefined) {
          proof_of_address = userDetails[0].proof_of_address;
        }

        if (profile_picture === undefined) {
          profile_picture = userDetails[0].profile_picture;
        }

        if (identification === undefined) {
          identification = userDetails[0].identification;
        }


        console.log(proof_of_address)
    //********Edit user user details */
    const updateUserDetails = await executeQuery({
      query: "UPDATE `users` SET `title` = ?, `pronouns` = ? , `first_name` = ?, `last_name` = ?, `address` = ?,  `dob` = ?, `gender` = ?, `about_me` = ?, `identification` = ? , `proof_of_address` = ?, `profile_picture` = ?, `lat` = ?, `lng` = ? WHERE id = ?",
      values: [
          req.body.title,
          req.body.pronouns,
          req.body.first_name,
          req.body.last_name,
          req.body.address,
          req.body.dob,
          req.body.gender,
          req.body.about_me,
          identification,
          proof_of_address,
          profile_picture,
          req.body.lat,
          req.body.lng,
          res.locals.user_id.id,
      ]
    });

    

    if (updateUserDetails.affectedRows > 0) {
      const updatedDetails = await executeQuery({
        query: `SELECT * FROM user_details_view WHERE user_details_view.email = ?`,
        values: [req.email],
      });
      logger("edit_user_details").info('User Updated : ',  updatedDetails[0])
      res.status(200).json(
        Response({
          success: true,
          message: "Details updated",
          data: updatedDetails[0],
        })
      );

    } else {
      const error = userDetails.error.sqlMessage;

      logger("edit_user_details").error('SQL Error : ',  {error})
      res.status(422).json(
        Response({
          success: false,
          message: userDetails.error.sqlMessage,
        })
      );
    }
  } catch (error) {
    logger("edit_user_details").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: ` System error -  ${error}`,
      })
    );
  }
};



module.exports = { createUserProfile, updateUserProfile, getUserDetails, editUserDetails };
