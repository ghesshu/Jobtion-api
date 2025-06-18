const db = require('../../db/connection_new.js');
const Response = require("../../utils/standardResponse.js");
const { getPathByFieldName } = require("../../utils/custom_function.js");
const logger = require ('../../utils/logger.js');
const bcrypt = require("bcrypt");
const { fetchUserByEmailOrID } = require("../../models/userModel.js");
const { getDetails } = require("../../middlewares/userMiddleware.js");
// const { insertQualifications } = require("../../middlewares/documentMiddleware.js");

const createUserProfile = async (req, res) => {
  try {
    //******get uploads files path */
    const { proof_of_address, profile_picture, identification } =
      getPathByFieldName(
        req.files,
        "proof_of_address",
        "profile_picture",
        "identification"
      );

    if (res.locals.user_type === "Client") {
      //*****update the details of user */
      const sql = "UPDATE users SET company_name = ?, first_name = ?, last_name = ?, address = ?,  crn = ?, urn = ?, about_me = ?, identification = ? , proof_of_address = ?, profile_picture = ?, lat = ?, lng = ? WHERE id = ?";
      const values = [
        req.body.company_name,
        req.body.first_name,
        req.body.last_name,
        req.body.address,
        req.body.crn,
        req.body.urn,
        req.body.about_me,
        identification === undefined ? "" : identification,
        proof_of_address === undefined ? "" : proof_of_address,
        profile_picture === undefined ? "" : profile_picture,
        req.body.lat,
        req.body.lng,
        res.locals.user_id.id,
      ];

      const result = await db.query(sql, values);

      if (result.affectedRows > 0) {
        // console.log("done");
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
      const sql = "UPDATE `users` SET `title` = ?, `pronouns` = ? , `first_name` = ?, `last_name` = ?, `address` = ?,  `dob` = ?, `gender` = ?, `about_me` = ?, `identification` = ? , `proof_of_address` = ?, `profile_picture` = ?, `lat` = ?, `lng` = ? WHERE id = ?";
      const values = [
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
      ];

      const result = await db.query(sql,values);

      if (result.affectedRows > 0) {
        // console.log("done");
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
        message: `System Error : ${error}`,
      })
    );
  }
};

// const updateUserProfile = async (req, res) => {
//   try {
//     //******get uploads files path */
//     const {
//       level_two,
//       level_three,
//       level_four_plus,
//       certificate,
//       dbs_certificate,
//       resume_cv,
//     } = getPathByFieldName(
//       req.files,
//       "level_two",
//       "level_three",
//       "level_four_plus",
//       "certificate",
//       "dbs_certificate",
//       "resume_cv"
//     );

//     //******variables for documentation */
//     let doc_sql;
//     let doc_values;

//     //******variables for qualifications */
//     let qualifications = {
//       qualifications: [
//         { type: "Level Two", upload_doc: level_two },
//         { type: "Level Three", upload_doc: level_three },
//         { type: "Level Four Plus", upload_doc: level_four_plus },
//       ],
//     };

//     //*******hitting qualifications middleware */
//     const storeQualification = insertQualifications(req, res, qualifications);
//     if (storeQualification === true) {
//       //*****check if user's documents already exits */
//       const doc_check_sql = "SELECT user_id FROM documents WHERE user_id = ?";
//       const doc_check_values = [res.locals.user_id.id];

//       const check = await db.query(doc_check_sql, doc_check_values);

//       if (check.length > 0) {
//         //*************Update the documents */
//         doc_sql =
//           "UPDATE documents SET certificate = ?, dbs_certificate = ?, dbs_expiry_date = ?, resume_cv = ?  WHERE user_id = ?";
//         doc_values = [
//           certificate,
//           dbs_certificate,
//           req.body.dbs_expiry_date,
//           resume_cv,
//           res.locals.user_id.id,
//         ];
//       } else {
//         //*************Save the documents */
//         doc_sql =
//           "INSERT INTO documents(user_id, certificate, dbs_certificate, dbs_expiry_date, resume_cv, created_at) VALUES(?,?,?,?,?,?,?,?,?)";
//         doc_values = [
//           res.locals.user_id.id,
//           certificate,
//           dbs_certificate,
//           req.body.dbs_expiry_date,
//           resume_cv,
//           new Date(),
//         ];
//       }

//       const saveDocuments = await db.query(doc_sql, doc_values);

//       if (saveDocuments.affectedRows > 0) {
//         //*******get all selected preference */
//         let selectedPreference;

//         if (typeof req.body.preference === "object") {
//           selectedPreference = req.body.preference;
//         } else {
//           selectedPreference = JSON.parse(req.body.preference);
//         }

//         await db.query(
//           `UPDATE preferences SET full_time = ? , part_time = ?, term_time = ?, after = ?  WHERE user_id = ?`,
//           [
//             selectedPreference.full_time,
//             selectedPreference.part_time,
//             selectedPreference.term_time,
//             selectedPreference.after,
//             res.locals.user_id.id,
//           ]
//         );

//         //   //   const selectedPreference =  typeof req.body.preference === 'string' ? JSON.parse(req.body.preference) : req.body.preference;

//         //   //   console.log(JSON.parse(selectedPreference).full_time)
//         //   //   for (const key in selectedPreference) {
//         //   //     const value = selectedPreference[key];
//         //   //     console.log(`Key: ${key}, Value: ${value}`);

//         //   //     await db.query(`UPDATE preferences SET ${key} = ${value} WHERE user_id = ?`,[res.locals.user_id.id]);
//         //   //   }

//         //     //*******get all selected job types */
//         let selectedJobTypes;

//         if (typeof req.body.job_types === "object") {
//           selectedJobTypes = req.body.job_types;
//         } else {
//           selectedJobTypes = JSON.parse(req.body.job_types);
//         }

//         await db.query(
//           `UPDATE job_types SET permanent = ? , temporary = ?, bookings = ?  WHERE user_id = ?`,
//           [
//             selectedJobTypes.permanent,
//             selectedJobTypes.temporary,
//             selectedJobTypes.bookings,
//             res.locals.user_id.id,
//           ]
//         );
//         //   const selectedJobTypes = typeof req.body.job_types === 'string' ? JSON.parse(req.body.job_types) : req.body.job_types;

//         //   for (const key in selectedJobTypes) {
//         //     const value = selectedJobTypes[key];
//         //     console.log(`Key: ${key}, Value: ${value}`);

//         //     await db.query(`UPDATE job_types SET ${key} = ${value} WHERE user_id = ?`,[res.locals.user_id.id]);
//         //   }

//         //*******get all selected job preferred */

//         const selectedJobPreferred = req.body.job_preferred || [];

//         if (selectedJobPreferred.length > 0) {
//           const keyValuePairs = selectedJobPreferred[0].split(",");
//           for (const job_preferred of keyValuePairs) {
//             await db.query(
//               "INSERT INTO job_role_preferences(user_id, job_role, created_at) VALUES(?,?,?)",
//               [res.locals.user_id.id, job_preferred, new Date()]
//             );
//           }
//         }

//         res.status(200).json(
//           Response({
//             success: true,
//             message: "Done",
//           })
//         );
//       } else {
//         res.status(422).json(
//           Response({
//             success: false,
//             message: saveDocuments.error.sqlMessage,
//           })
//         );
//       }
//     }
//     else{
//       res.status(500).json(
//         Response({
//           success: false,
//           message: `error`,
//         })
//       );
//     }
//   } catch (error) {
//     // console.log(error)
//     res.status(500).json(
//       Response({
//         success: false,
//         message: `${error}`,
//       })
//     );
//   }
// };

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

    let doc_sql;
    let doc_values;

    //*****check if user's documents already exits */

    const doc_check_sql = "SELECT user_id FROM documents WHERE user_id = ?";
    const doc_check_values = [res.locals.user_id.id];

    const check = await db.query(doc_check_sql,doc_check_values);

    if (check.length > 0) {
        //*************Update the documents */
        doc_sql = "UPDATE documents SET level_two = ? , level_three = ? , level_four_plus = ?, certificate = ?, dbs_certificate = ?, dbs_expiry_date = ?, resume_cv = ?  WHERE user_id = ?";
        doc_values = [
          level_two,
          level_three,
          level_four_plus,
          certificate,
          dbs_certificate,
          req.body.dbs_expiry_date,
          resume_cv,
          res.locals.user_id.id,
      ];
    }
    else{
        //*************Save the documents */
         doc_sql = "INSERT INTO documents(user_id, level_two, level_three, level_four_plus, certificate, dbs_certificate, dbs_expiry_date, resume_cv, created_at) VALUES(?,?,?,?,?,?,?,?,?)";
         doc_values = [
            res.locals.user_id.id,
            level_two,
            level_three,
            level_four_plus,
            certificate,
            dbs_certificate,
            req.body.dbs_expiry_date,
            resume_cv,
            new Date(),
        ];
    }
    


    const saveDocuments = await db.query(doc_sql,doc_values);

    if (saveDocuments.affectedRows > 0) {
      //*******get all selected preference */
      let selectedPreference;

      if (typeof req.body.preference === "object") {
        selectedPreference = req.body.preference
      }
      else{
        selectedPreference = JSON.parse(req.body.preference)
      }
      
      await db.query(`UPDATE preferences SET full_time = ? , part_time = ?, term_time = ?, after = ?  WHERE user_id = ?`,
      [selectedPreference.full_time,selectedPreference.part_time,selectedPreference.term_time,selectedPreference.after,res.locals.user_id.id]);

  //   //   const selectedPreference =  typeof req.body.preference === 'string' ? JSON.parse(req.body.preference) : req.body.preference;

  //   //   console.log(JSON.parse(selectedPreference).full_time)
  //   //   for (const key in selectedPreference) {
  //   //     const value = selectedPreference[key];
  //   //     console.log(`Key: ${key}, Value: ${value}`);

  //   //     await db.query(`UPDATE preferences SET ${key} = ${value} WHERE user_id = ?`,[res.locals.user_id.id]);
  //   //   }

  //     //*******get all selected job types */
      let selectedJobTypes;

      if (typeof req.body.job_types === "object") {
        selectedJobTypes = req.body.job_types
      }
      else{
        selectedJobTypes = JSON.parse(req.body.job_types)
      }

      await db.query(`UPDATE job_types SET permanent = ? , temporary = ?, bookings = ?  WHERE user_id = ?`,
      [selectedJobTypes.permanent,selectedJobTypes.temporary,selectedJobTypes.bookings,res.locals.user_id.id]);
  //   const selectedJobTypes = typeof req.body.job_types === 'string' ? JSON.parse(req.body.job_types) : req.body.job_types;

    //   for (const key in selectedJobTypes) {
    //     const value = selectedJobTypes[key];
    //     console.log(`Key: ${key}, Value: ${value}`);

    //     await db.query(`UPDATE job_types SET ${key} = ${value} WHERE user_id = ?`,[res.locals.user_id.id]);
    //   }

      //*******get all selected job preferred */
      const selectedJobPreferred = req.body.job_preferred || [];

      if (selectedJobPreferred.length > 0) {
        const keyValuePairs = selectedJobPreferred[0].split(',');
        for (const job_preferred of keyValuePairs) {
          await db.query( "INSERT INTO job_role_preferences(user_id, job_role, created_at) VALUES(?,?,?)", [res.locals.user_id.id, job_preferred, new Date()]);
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
        message: `${error}`,
      })
    );
  }
};

const getUserDetails = async (req, res) => {
  try {
    const fetching = await getDetails(req, res);

    if (fetching) {

      res.status(200).json(
        Response({
          success: true,
          message: "Details fetched",
          data: fetching.details,
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
        message: ` System error -  ${error}`,
      })
    );
  }
};

const editUserDetails = async (req, res) => {
  try {
     //********Get user user details */
     const userDetails = await db.query("SELECT * FROM user_details_view WHERE user_details_view.email = ?",[req.email]);



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

    //********Edit user user details */
    const updateUserDetails = await db.query( "UPDATE `users` SET `title` = ?, `pronouns` = ? , `first_name` = ?, `last_name` = ?, `address` = ?,  `dob` = ?, `gender` = ?, `about_me` = ?, `identification` = ? , `proof_of_address` = ?, `profile_picture` = ?, `lat` = ?, `lng` = ? WHERE id = ?", [
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
      ]);

    

    if (updateUserDetails.affectedRows > 0) {
      const updatedDetails = await db.query("SELECT * FROM user_details_view WHERE user_details_view.email = ?",[req.email]);

      logger("edit_user_details").info('User Updated : ',  updatedDetails[0])
      
      const fetching = await getDetails(req, res);

    if (fetching) {

      res.status(200).json(
        Response({
          success: true,
          message: "Details fetched",
          data: fetching.details,
        })
      );
    }
    else{
      logger("fetching_user_details").error('Fetching Error : ',  {fetching})
      res.status(200).json(
        Response({
          success: true,
          message: "Details update",
        })
      );
    }

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

const changePassword = async(req, res) => {
   //****check users if user exits*/
   const response = await fetchUserByEmailOrID(req.email, false);

  //********verify the password */
  const verifyPassword = await bcrypt.compare(
    req.body.password,
    response[0].password
  );

  if (!verifyPassword) {
    logger("user_reset_password").error('Wrong Password : ',  req.email)
    return res.status(422).send(
      Response({
        success: false,
        message: "Incorrect password !",
      })
    );
  }

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

  //*******update user password */
  const updatePassword = await db.query("UPDATE users SET password = ? WHERE id = ?",[hashPassword,res.locals.user_id.id]);

  if (updatePassword.affectedRows > 0) {
    return res.status(201).send(
      Response({
        success: true,
        message: "Password updated successfully !",
      })
    );
  }
  
}

const deleteUser = async (req, res) => {
  try {
    const sql = "DELETE FROM users WHERE email = ?";
    const values = [req.body.email];

    const del = await db.query(sql,values);

    if(del.affectedRows > 0){
      return res.status(201).send(
        Response({
          success: true,
          message: `User ${req.body.email} Wiped Successfully !`,
        })
      );
    }
    else{
      return res.status(422).send(
        Response({
          success: false,
          message: `Failed to wipe user - ${req.body.email} !`,
        })
      );
    }
  } catch (error) {
    logger("delete_user").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: ` System error -  ${error}`,
      })
    );
  }
}



module.exports = { createUserProfile, updateUserProfile, getUserDetails, editUserDetails, changePassword, deleteUser };
