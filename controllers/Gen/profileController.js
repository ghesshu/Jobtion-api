const db = require("../../db/connection_new.js");
const Response = require("../../utils/standardResponse.js");
const { getPathByFieldName } = require("../../utils/custom_function.js");
const logger = require("../../utils/logger.js");
const bcrypt = require("bcrypt");
const { fetchUserByEmailOrID } = require("../../models/userModel.js");
const { getDetails } = require("../../middlewares/userMiddleware.js");
const {
  insertQualifications, updateQualifications
} = require("../../middlewares/documentMiddleware.js");
const {otp_generate, verify, signupOTP, modifyOTP } = require("./otpController.js");
const { singleSignOn, reLogin } = require("./authController.js");

const createUserProfile = async (req, res) => {
  try {
    //******get uploads files path */
    const { proof_of_address, profile_picture, identification, national_identity } =
      getPathByFieldName(
        req.files,
        "proof_of_address",
        "profile_picture",
        "identification",
        "national_identity"
      );

    if (res.locals.user_type === "Client") {
      //*****update the details of user */
      const sql =
        "UPDATE users SET company_name = ?, first_name = ?, last_name = ?, address = ?,  crn = ?, urn = ?, about_me = ?, identification = ? , proof_of_address = ?, profile_picture = ?, lat = ?, lng = ? WHERE id = ?";
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
        national_identity === undefined ? "" : national_identity,
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
        logger("create_user_profile").error("Bug : ", result);
        res.status(417).json(
          Response({
            success: false,
            message: "Bad request",
          })
        );
      }
    } else {
      //*****update the details of user */
      const sql =
        "UPDATE users SET title = ?, pronouns = ? , first_name = ?, last_name = ?, phone_number = ?, address = ?,  dob = ?, gender = ?, about_me = ?, identification = ? , proof_of_address = ?, profile_picture = ?, national_identity = ?, lat = ?, lng = ? WHERE id = ?";
      const values = [
        req.body.title,
        req.body.pronouns,
        req.body.first_name,
        req.body.last_name,
        req.body.phone_number,
        req.body.address,
        req.body.dob,
        req.body.gender,
        req.body.about_me,
        identification,
        proof_of_address,
        profile_picture,
        national_identity,
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
        logger("create_user_profile").error("Bug : ", result);
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
    logger("create_user_profile").error("System Error : ", error);
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
//       // level_two,
//       // level_three,
//       // level_four_plus,
//       level_file,
//       certificate,
//       // dbs_certificate,
//       resume_cv,
//     } = getPathByFieldName(
//       req.files,
//       // "level_two",
//       // "level_three",
//       // "level_four_plus",
//       "level_file",
//       "certificate",
//       // "dbs_certificate",
//       "resume_cv"
//     );

//     console.log(req.files)

//     //******variables for documentation */
//     let doc_sql;
//     let doc_values;
//     let storeQualification;

//     //******variables for qualifications */
//     // identification === undefined ? "" : identification,
//     //     proof_of_address === undefined ? "" : proof_of_address,
//     //     profile_picture === undefined ? "" : profile_picture,

//     let qualifications = {
//       qualifications: [
//         // { type: "Level Two", upload_doc:  level_two === undefined ? "" : level_two },
//         // { type: "Level Three", upload_doc: level_three === undefined ? "" : level_three },
//         // { type: "Level Four Plus", upload_doc: level_four_plus === undefined ? "" : level_four_plus },
//         { type: req.body.level_name, upload_doc: level_file === undefined ? "" : level_file },
//       ],
//     };

//     console.log(qualifications);

//     //***Check if the user has already upload the qualification docs */
//     const check = await db.query(
//       "SELECT * FROM qualifications WHERE user_id = ?",
//       [res.locals.user_id.id]
//     );

//     if (check.length > 0) {
//       console.log("Qualifications Update Area");
//           //*******hitting qualifications middleware for updating the data */
//           storeQualification = await updateQualifications(req, res, qualifications);
//     }
//     else{
//       console.log("Qualifications Insert Area");
//       //*******hitting qualifications middleware for inserting new data */
//       storeQualification = await insertQualifications(req, res, qualifications);
//     }
    
    

//     if (storeQualification === true) {
//       //*****check if user's documents already exits */
//       const doc_check_sql = "SELECT * FROM documents WHERE user_id = ?";
//       const doc_check_values = [res.locals.user_id.id];

//       const check = await db.query(doc_check_sql, doc_check_values);

//       if (check.length > 0) {
//         //*************Update the documents */
//         console.log("Documents Area Update: ",req.body.dbs_on_server == "true" || true ? 1 : 0);
//         // doc_sql = "UPDATE documents SET certificate = ?, dbs_certificate = ?, dbs_expiry_date = ?, resume_cv = ?  WHERE user_id = ?";
//         doc_sql = "UPDATE documents SET certificate = ?, dbs_on_server = ?, dbs_expiry_date = ?, dbs_serial_number = ?, resume_cv = ?  WHERE user_id = ?";
//         doc_values = [
//           certificate === undefined ? check[0].certificate : certificate,
//           // dbs_certificate === undefined ? check[0].dbs_certificate : dbs_certificate,
//           req.body.dbs_on_server === undefined ? check[0].dbs_on_server : req.body.dbs_on_server ===  "true" || true ? 1 : 0,
//           req.body.dbs_expiry_date === undefined ? check[0].dbs_expiry_date : req.body.dbs_expiry_date,
//           req.body.dbs_serial_number === undefined ? check[0].dbs_serial_number : req.body.dbs_serial_number,
//           resume_cv === undefined ? check[0].resume_cv : resume_cv,
//           res.locals.user_id.id,
//         ];
        
//       } else {
//         console.log("Documents Area Insert");
//         //*************Save the documents */
//         // doc_sql ="INSERT INTO documents(user_id, certificate, dbs_certificate, dbs_expiry_date, resume_cv, created_at) VALUES(?,?,?,?,?,?)";
//         doc_sql ="INSERT INTO documents(user_id, certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv, created_at) VALUES(?,?,?,?,?,?,?)";
//         doc_values = [
//           res.locals.user_id.id,
//           certificate === undefined ? "" : certificate,
//           // dbs_certificate === undefined ? "" : dbs_certificate,
//           req.body.dbs_on_server === undefined ? "" : req.body.dbs_on_server === true ? 1 : 0,
//           req.body.dbs_expiry_date === undefined ? "" : req.body.dbs_expiry_date,
//           req.body.dbs_serial_number === undefined ? "" : req.body.dbs_serial_number,
//           resume_cv === undefined ? "" : resume_cv,
//           new Date(),
//         ];
//       }
      

//       const saveDocuments = await db.query(doc_sql, doc_values);

//       if (saveDocuments.affectedRows > 0) {
//         logger("documents").info("Documents Response : ", saveDocuments);
//         //*******get all selected preference */
//         let selectedPreference;

//         if (typeof req.body.preference === "object") {
//           req.body.preference === undefined ? false : selectedPreference =  JSON.parse(req.body.preference[0]);
//         } else {
//           req.body.preference === undefined ? false : selectedPreference = JSON.parse(req.body.preference);
//         }

//         if (req.body.preference !== undefined) {
//           //*******get all selected preference */
//           const Select_preferences = await db.query(
//             `UPDATE preferences SET full_time = ? , part_time = ?, term_time = ?, after = ?  WHERE user_id = ?`,
//             [
//               selectedPreference.full_time,
//               selectedPreference.part_time,
//               selectedPreference.term_time,
//               selectedPreference.after,
//               res.locals.user_id.id,
//             ]
//           );
  
//           logger("selected_preferences").info("Selected Preferences Response : ", Select_preferences);
//         }
      

//          //*******get all selected job types */
//         let selectedJobTypes;
//       logger("request_jobs").info("Jobs Request: ", req.body.job_types);

//         if (typeof req.body.job_types === "object") {
//           console.log("Job Types Area");
//           req.body.job_types === undefined ? false : selectedJobTypes = JSON.parse(req.body.job_types[0]);
//         } else {
//           req.body.job_types === undefined ? false : selectedJobTypes = JSON.parse(req.body.job_types);
//         }

//         if (req.body.job_types !== undefined) {
//           const Selected_job_types = await db.query(
//             `UPDATE job_types SET permanent = ? , temporary = ?, bookings = ?  WHERE user_id = ?`,
//             [
//               selectedJobTypes.permanent,
//               selectedJobTypes.temporary,
//               selectedJobTypes.bookings,
//               res.locals.user_id.id,
//             ]
//           );
  
//           logger("selected_job_types").info("Selected Job Types Response : ", Selected_job_types);
//         }
     

//         //*******get all selected job preferred */
//         const selectedJobPreferred = req.body.job_preferred || [];

//         logger("request_job_preferred").info("Jobs Request: ", req.body.job_preferred);
//         logger("request_job_preferred_selected").info("Jobs Request: ", selectedJobPreferred);

//         //****check if the job preferred is empty for the user in the database */
//         const check = await db.query(
//           "SELECT * FROM job_role_preferences WHERE user_id = ?",
//           [res.locals.user_id.id]
//         );

//         if (check.length > 0) {
//           await db.query(
//             "DELETE FROM job_role_preferences WHERE user_id = ?",
//             [res.locals.user_id.id]
//           );
//         }

//         if (selectedJobPreferred.length > 0) {
//           const keyValuePairs = selectedJobPreferred[0].split(",");
//           for (const job_preferred of keyValuePairs) {

//               await db.query(
//                 "INSERT INTO job_role_preferences(user_id, job_role, created_at) VALUES(?,?,?)",
//                 [res.locals.user_id.id, job_preferred, new Date()]
//               );
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
//           message: "There was an issue processing the request !",
//         })
//       );
//     }
//   } catch (error) {
//     console.log(error)
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
      // level_two,
      // level_three,
      // level_four_plus,
      level_file,
      certificate,
      // dbs_certificate,
      resume_cv,
      right_to_work_doc,
    } = getPathByFieldName(
      req.files,
      // "level_two",
      // "level_three",
      // "level_four_plus",
      "level_file",
      "certificate",
      // "dbs_certificate",
      "resume_cv",
      "right_to_work_doc"
    );

    console.log(req.files)

    //******variables for documentation */
    let doc_sql;
    let doc_values;
    let storeQualification;

    //******variables for qualifications */
    // identification === undefined ? "" : identification,
    //     proof_of_address === undefined ? "" : proof_of_address,
    //     profile_picture === undefined ? "" : profile_picture,

    let qualifications = {
      qualifications: [
        // { type: "Level Two", upload_doc:  level_two === undefined ? "" : level_two },
        // { type: "Level Three", upload_doc: level_three === undefined ? "" : level_three },
        // { type: "Level Four Plus", upload_doc: level_four_plus === undefined ? "" : level_four_plus },
        { type: req.body.level_name, upload_doc: level_file === undefined ? "" : level_file },
      ],
    };

    console.log(qualifications);

    //***Check if the user has already upload the qualification docs */
    const check = await db.query(
      "SELECT * FROM qualifications WHERE user_id = ?",
      [res.locals.user_id.id]
    );

    if (check.length > 0) {
      console.log("Qualifications Update Area");
          //*******hitting qualifications middleware for updating the data */
          storeQualification = await updateQualifications(req, res, qualifications);
    }
    else{
      console.log("Qualifications Insert Area");
      //*******hitting qualifications middleware for inserting new data */
       storeQualification = await insertQualifications(req, res, qualifications);
    }
    
    

    if (storeQualification === true) {
      //*****check if user's documents already exits */
      const doc_check_sql = "SELECT * FROM documents WHERE user_id = ?";
      const doc_check_values = [res.locals.user_id.id];

      const check = await db.query(doc_check_sql, doc_check_values);

      if (check.length > 0) {
        //*************Update the documents */
        console.log("Documents Area Update: ",req.body.dbs_on_server == "true" || true ? 1 : 0);
        // doc_sql = "UPDATE documents SET certificate = ?, dbs_certificate = ?, dbs_expiry_date = ?, resume_cv = ?  WHERE user_id = ?";
        doc_sql = "UPDATE documents SET certificate = ?, dbs_on_server = ?, dbs_expiry_date = ?, dbs_serial_number = ?, resume_cv = ? , citizen = ?, right_to_work_doc = ?, right_to_work = ?  WHERE user_id = ?";
        doc_values = [
          certificate === undefined ? check[0].certificate : certificate,
          // dbs_certificate === undefined ? check[0].dbs_certificate : dbs_certificate,
          req.body.dbs_on_server === undefined ? check[0].dbs_on_server : req.body.dbs_on_server ===  "true" || true ? 1 : 0,
          req.body.dbs_expiry_date === undefined ? check[0].dbs_expiry_date : req.body.dbs_expiry_date,
          req.body.dbs_serial_number === undefined ? check[0].dbs_serial_number : req.body.dbs_serial_number,
          resume_cv === undefined ? check[0].resume_cv : resume_cv,
          req.body.citizen === undefined ? req.body.right_to_work === "false" || false ? 0 : check[0].citizen : req.body.right_to_work === false ? 0 : req.body.citizen === "true" || true ? 1 : 0,
          right_to_work_doc === undefined ? req.body.right_to_work === "false" || false ? '' : req.body.citizen === "false" || false ? check[0].right_to_work_doc : '' : req.body.right_to_work === "false" || false ? '' : req.body.citizen === "false" || false ? right_to_work_doc : '',
          req.body.right_to_work === undefined ? check[0].right_to_work : req.body.right_to_work === "true" || true ? 1 : 0,
          res.locals.user_id.id,
        ];
        
      } else {
        console.log("Documents Area Insert");
        //*************Save the documents */
        // doc_sql ="INSERT INTO documents(user_id, certificate, dbs_certificate, dbs_expiry_date, resume_cv, created_at) VALUES(?,?,?,?,?,?)";
        doc_sql ="INSERT INTO documents(user_id, certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv, citizen, right_to_work_doc, right_to_work, created_at) VALUES(?,?,?,?,?,?,?,?,?,?)";
        doc_values = [
          res.locals.user_id.id,
          certificate === undefined ? "" : certificate,
          // dbs_certificate === undefined ? "" : dbs_certificate,
          req.body.dbs_on_server === undefined ? "" : req.body.dbs_on_server === "true" || true ? 1 : 0,
          req.body.dbs_expiry_date === undefined ? "" : req.body.dbs_expiry_date,
          req.body.dbs_serial_number === undefined ? "" : req.body.dbs_serial_number,
          resume_cv === undefined ? "" : resume_cv,
          req.body.citizen === undefined ? "" : req.body.citizen === "true" || true ? 1 : 0,
          right_to_work_doc === undefined ? "" : req.body.right_to_work === false ? '' : right_to_work_doc,
          req.body.right_to_work === undefined ? "" : req.body.right_to_work === "true" || true ? 1 : 0,
          new Date(),
        ];
      }
      

      const saveDocuments = await db.query(doc_sql, doc_values);

      if (saveDocuments.affectedRows > 0) {
        logger("documents").info("Documents Response : ", saveDocuments);
        //*******get all selected preference */
        let selectedPreference;

        if (typeof req.body.preference === "object") {
          req.body.preference === undefined ? false : selectedPreference =  JSON.parse(req.body.preference[0]);
        } else {
          req.body.preference === undefined ? false : selectedPreference = JSON.parse(req.body.preference);
        }

        if (req.body.preference !== undefined) {
          //*******get all selected preference */
          const Select_preferences = await db.query(
            `UPDATE preferences SET full_time = ? , part_time = ?, term_time = ?, after = ?  WHERE user_id = ?`,
            [
              selectedPreference.full_time,
              selectedPreference.part_time,
              selectedPreference.term_time,
              selectedPreference.after,
              res.locals.user_id.id,
            ]
          );
  
          logger("selected_preferences").info("Selected Preferences Response : ", Select_preferences);
        }
      

         //*******get all selected job types */
        let selectedJobTypes;
       logger("request_jobs").info("Jobs Request: ", req.body.job_types);

        if (typeof req.body.job_types === "object") {
          console.log("Job Types Area");
          req.body.job_types === undefined ? false : selectedJobTypes = JSON.parse(req.body.job_types[0]);
        } else {
          req.body.job_types === undefined ? false : selectedJobTypes = JSON.parse(req.body.job_types);
        }

        if (req.body.job_types !== undefined) {
          const Selected_job_types = await db.query(
            `UPDATE job_types SET permanent = ? , temporary = ?, bookings = ?  WHERE user_id = ?`,
            [
              selectedJobTypes.permanent,
              selectedJobTypes.temporary,
              selectedJobTypes.bookings,
              res.locals.user_id.id,
            ]
          );
  
          logger("selected_job_types").info("Selected Job Types Response : ", Selected_job_types);
        }
     

        //*******get all selected job preferred */
        const selectedJobPreferred = req.body.job_preferred || [];

        logger("request_job_preferred").info("Jobs Request: ", req.body.job_preferred);
        logger("request_job_preferred_selected").info("Jobs Request: ", selectedJobPreferred);

        //****check if the job preferred is empty for the user in the database */
        const check = await db.query(
          "SELECT * FROM job_role_preferences WHERE user_id = ?",
          [res.locals.user_id.id]
        );

        if (check.length > 0) {
          await db.query(
            "DELETE FROM job_role_preferences WHERE user_id = ?",
            [res.locals.user_id.id]
          );
        }

        if (selectedJobPreferred.length > 0) {
          const keyValuePairs = selectedJobPreferred[0].split(",");
          for (const job_preferred of keyValuePairs) {

              await db.query(
                "INSERT INTO job_role_preferences(user_id, job_role, created_at) VALUES(?,?,?)",
                [res.locals.user_id.id, job_preferred, new Date()]
              );
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
    }
    else{
      res.status(500).json(
        Response({
          success: false,
          message: "There was an issue processing the request !",
        })
      );
    }
  } catch (error) {
    console.log(error)
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
      logger("get_user_details").error("SQL Error : ", { error });
      res.status(422).json(
        Response({
          success: false,
          message: userDetails.error.sqlMessage,
        })
      );
    }
  } catch (error) {
    logger("get_user_details").error("System Error : ", error);
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
    const userDetails = await db.query(
      "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
      [req.email]
    );

    let { proof_of_address, profile_picture, identification, national_identity } =
      getPathByFieldName(
        req.files,
        "proof_of_address",
        "profile_picture",
        "identification",
        "national_identity"
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

    if (national_identity === undefined) {
      national_identity = userDetails[0].national_identity;
    }

    //********Edit user user details */
    const updateUserDetails = await db.query(
      "UPDATE `users` SET `title` = ?, `pronouns` = ? , `first_name` = ?, `last_name` = ?, `address` = ?, `phone_number` = ? , `dob` = ?, `gender` = ?, `about_me` = ?, `identification` = ? , `proof_of_address` = ?, `profile_picture` = ?, `national_identity` = ?, `lat` = ?, `lng` = ? WHERE id = ?",
      [
        req.body.title,
        req.body.pronouns,
        req.body.first_name,
        req.body.last_name,
        req.body.address,
        req.body.phone_number,
        req.body.dob,
        req.body.gender,
        req.body.about_me,
        identification,
        proof_of_address,
        profile_picture,
        national_identity,
        req.body.lat,
        req.body.lng,
        res.locals.user_id.id,
      ]
    );

    if (updateUserDetails.affectedRows > 0) {
      const updatedDetails = await db.query(
        "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
        [req.email]
      );

      logger("edit_user_details").info("User Updated : ", updatedDetails[0]);

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
        logger("fetching_user_details").error("Fetching Error : ", {
          fetching,
        });
        res.status(200).json(
          Response({
            success: true,
            message: "Details update",
          })
        );
      }
    } else {
      const error = userDetails.error.sqlMessage;

      logger("edit_user_details").error("SQL Error : ", { error });
      res.status(422).json(
        Response({
          success: false,
          message: userDetails.error.sqlMessage,
        })
      );
    }
  } catch (error) {
    logger("edit_user_details").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: ` System error -  ${error}`,
      })
    );
  }
};

const changePassword = async (req, res) => {
  try {
     //****check users if user exits*/
  const response = await fetchUserByEmailOrID(req.email, false);

  //********verify the password */
  const verifyPassword = await bcrypt.compare(
    req.body.password,
    response[0].password
  );

  if (!verifyPassword) {
    logger("user_reset_password").error("Wrong Password : ", req.email);
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
  const updatePassword = await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashPassword, res.locals.user_id.id]
  );

  if (updatePassword.affectedRows > 0) {
    return res.status(201).send(
      Response({
        success: true,
        message: "Password updated successfully !",
      })
    );
  }
  } catch (error) {
    logger("change_user_password").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: ` System error -  ${error}`,
      })
    );
  }
 
};

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

// const updateUserEmail = async (req, res) => {
//   try {

//     //****check if email exists */
//     if(!!!req.body.code){
//       const checkEmail = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email]);

//       if (checkEmail.length > 0) {
//         return res.status(422).send(
//           Response({
//             success: false,
//             message: "Email already exists",
//           })
//         );
//       }

//       // req = {
//       //   'email' : req.body.email,
//       //   'phone_number':'000000000'
//       // }


//       //*******Send OTP to*/
//       modifyOTP(req, res);
//     }
//     else{
//       const modification = await verify(req,res,'modification');

//     if (modification === true) {
//       const updateEmail = await db.query(
//       "UPDATE users SET email = ? WHERE id = ?",
//       [req.body.email, res.locals.user_id.id]
//     );

//     if (updateEmail.affectedRows > 0) {

//       res.status(200).json(
//         Response({
//           success: true,
//           message: `Email updated successfully !`,
//         })
//       );
//     }
//     else{
//       res.status(422).json(
//         Response({
//           success: false,
//           message: `Failed to update email - ${req.body.email} !`,
//         })
//       );
//     }
//     }
//     }    
    

    
    
//   } catch (error) {
//     logger("change_user_email").error("System Error : ", error);
//     res.status(500).json(
//       Response({
//         success: false,
//         message: ` System error -  ${error}`,
//       })
//     );
//   }
// };

const updateUserEmail = async (req, res) => {
  try {

    //****check if email exists */
    if(!!!req.body.code){
      
        //*******Send OTP to*/
        modifyOTP(req, res);
      }
    else{
      const modification = await verify(req,res,'modification');

    if (modification === true) {

      const checkEmail = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
      const oldToken = res.locals.user_id.id
      console.log("old token : ", oldToken);

      if (checkEmail.length > 0) {
        //*******re-login the user and delete the current session */
        reLogin(req, res, oldToken);
      }
      else{
        const updateEmail = await db.query(
          "UPDATE users SET email = ? WHERE id = ?",
          [req.body.email, res.locals.user_id.id]
        );
    
        if (updateEmail.affectedRows > 0) {
          const payload = {
            access_token: '',
          };
          res.status(200).json(
            Response({
              success: true,
              message: `Email updated successfully !`,
              data: payload,
            })
          );
        }
        else{
          res.status(422).json(
            Response({
              success: false,
              message: `Failed to update email - ${req.body.email} !`,
            })
          );
        }
      }
    }
    }    
    

    
    
  } catch (error) {
    logger("change_user_email").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: ` System error -  ${error}`,
      })
    );
  }
};

module.exports = {
  createUserProfile,
  updateUserProfile,
  getUserDetails,
  editUserDetails,
  changePassword,
  deleteUser,
  updateUserEmail,
};
