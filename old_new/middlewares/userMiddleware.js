const { access } = require("fs-extra");
const executeQuery = require("../db/serverless_connection.js");
const db = require('../db/connection_new.js');


const getDetails = async (req,res) => {
  const details = await db.query("SELECT * FROM user_details_view WHERE user_details_view.email = ?", [req.email]);

    //*******Get  Preferences*/
    const preference = await db.query("SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  Job Type*/
    const jobType = await db.query("SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  Job Type*/
    const job_role_preferences = await db.query("SELECT id, job_role FROM job_role_preferences WHERE user_id = ? ",[res.locals.user_id.id]);

    //*******Get  Experiences*/
    const experience = await db.query("SELECT id, exp FROM experience WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  documents*/
    const document = await db.query("SELECT level_two, level_three, level_four_plus, certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  qualifications*/
    const qualification = await db.query("SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",[res.locals.user_id.id]);


    if (details.length > 0) {
      const payload = {
        "userDetails":{
          details,
            preference,
            jobType,
            job_role_preferences,
            experience,
            document,
            qualification
        }
      };

      return {"details":payload, "code":200};
      // res.status(200).json(
      //   Response({
      //     success: true,
      //     message: "Details fetched",
      //     data: payload,
      //   })
      // );
    } else {
      // const error = userDetails.error.sqlMessage;
      // logger("get_user_details").error('SQL Error : ',  {error})
      // res.status(422).json(
      //   Response({
      //     success: false,
      //     message: userDetails.error.sqlMessage,
      //   })
      // );

      return false;
    }
}

// const getDetails = async (req,res) => {
//     const details = await executeQuery({
//         query: `SELECT * FROM user_details_view WHERE user_details_view.email = ?`,
//         values: [req.email],
//       });
  
//       //*******Get  Preferences*/
//       // const preference = await executeQuery({
//       //   query: `SELECT id, preference, booked FROM preferences WHERE user_id = ?`,
//       //   values: [res.locals.user_id.id],
//       // });
//       const preference = await executeQuery({
//         query: `SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });
  
//       //*******Get  Job Type*/
//       const jobType = await executeQuery({
//         query: `SELECT id, type FROM job_types WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });
  
//       //*******Get  Job Type*/
//       const job_role_preferences = await executeQuery({
//         query: `SELECT id, job_role FROM job_role_preferences WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       //*******Get  Experiences*/
//       const experience = await executeQuery({
//         query: `SELECT id, exp FROM experience WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       //*******Get  documents*/
//       const document = await executeQuery({
//         query: `SELECT level_two, level_three, level_four_plus, certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       //*******Get  qualifications*/
//       const qualification = await executeQuery({
//         query: `SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });


//       if (details.length > 0) {
//         const payload = {
//           "userDetails":{
//             details,
//               preference,
//               jobType,
//               job_role_preferences,
//               experience,
//               document,
//               qualification
//           }
//         };
  
//         return {"details":payload, "code":200};
//         // res.status(200).json(
//         //   Response({
//         //     success: true,
//         //     message: "Details fetched",
//         //     data: payload,
//         //   })
//         // );
//       } else {
//         // const error = userDetails.error.sqlMessage;
//         // logger("get_user_details").error('SQL Error : ',  {error})
//         // res.status(422).json(
//         //   Response({
//         //     success: false,
//         //     message: userDetails.error.sqlMessage,
//         //   })
//         // );

//         return false;
//       }
// }

const getLoginDetails = async (req,res) => {
  const details = await db.query("SELECT * FROM user_details_view WHERE user_details_view.email = ?", [req.email]);

    //*******Get  Preferences*/
    const preference = await db.query("SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  Job Type*/
    const jobType = await db.query("SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  Job Type*/
    const job_role_preferences = await db.query("SELECT id, job_role FROM job_role_preferences WHERE user_id = ? ",[res.locals.user_id.id]);

    //*******Get  Experiences*/
    const experience = await db.query("SELECT id, exp FROM experience WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  documents*/
    const document = await db.query("SELECT level_two, level_three, level_four_plus, certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);

    //*******Get  qualifications*/
    const qualification = await db.query("SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",[res.locals.user_id.id]);


    const access_token = res.locals.tokens


      if (details.length > 0) {
        const payload = {
          "userDetails":{
            details,
              preference,
              jobType,
              job_role_preferences,
              experience,
              document,
              qualification,
              access_token
          }
        };

      return {"details":payload, "code":200};
      // res.status(200).json(
      //   Response({
      //     success: true,
      //     message: "Details fetched",
      //     data: payload,
      //   })
      // );
    } else {
      // const error = userDetails.error.sqlMessage;
      // logger("get_user_details").error('SQL Error : ',  {error})
      // res.status(422).json(
      //   Response({
      //     success: false,
      //     message: userDetails.error.sqlMessage,
      //   })
      // );

      return false;
    }
}

// const getLoginDetails = async (req,res) => {
//     const details = await executeQuery({
//         query: `SELECT * FROM user_details_view WHERE user_details_view.email = ?`,
//         values: [req.email],
//       });
  
//       //*******Get  Preferences*/
//       const preference = await executeQuery({
//         query: `SELECT id, preference, booked FROM preferences WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });
  
//       //*******Get  Job Type*/
//       const jobType = await executeQuery({
//         query: `SELECT type FROM job_types WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });
  
//       //*******Get  Job Type*/
//       const job_role_preferences = await executeQuery({
//         query: `SELECT job_role FROM job_role_preferences WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       //*******Get  Experiences*/
//       const experience = await executeQuery({
//         query: `SELECT id, exp FROM experience WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       //*******Get  documents*/
//       const document = await executeQuery({
//         query: `SELECT level_two, level_three, level_four_plus, certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       //*******Get  qualifications*/
//       const qualification = await executeQuery({
//         query: `SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?`,
//         values: [res.locals.user_id.id],
//       });

//       const access_token = res.locals.tokens


//       if (details.length > 0) {
//         const payload = {
//           "userDetails":{
//             details,
//               preference,
//               jobType,
//               job_role_preferences,
//               experience,
//               document,
//               qualification,
//               access_token
//           }
//         };
  
//         return {"details":payload, "code":200};
//         // res.status(200).json(
//         //   Response({
//         //     success: true,
//         //     message: "Details fetched",
//         //     data: payload,
//         //   })
//         // );
//       } else {
//         // const error = userDetails.error.sqlMessage;
//         // logger("get_user_details").error('SQL Error : ',  {error})
//         // res.status(422).json(
//         //   Response({
//         //     success: false,
//         //     message: userDetails.error.sqlMessage,
//         //   })
//         // );

//         return false;
//       }
// }


module.exports = { getDetails, getLoginDetails }