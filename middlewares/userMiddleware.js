// const { access } = require("fs-extra");
// const db = require('../db/connection_new.js');
// const crypto = require("crypto");

// const secret = crypto.randomBytes(32);

// // Encrypt
// const encryptId = (id) => {
//   const cipher = crypto.createCipheriv("aes-256-ctr", secret, Buffer.alloc(16, 0));
//   return Buffer.concat([cipher.update(String(id)), cipher.final()]).toString("hex");
// };

// // Decrypt
// const decryptId = (encrypted) => {
//   const decipher = crypto.createDecipheriv("aes-256-ctr", secret, Buffer.alloc(16, 0));
//   return Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]).toString();
// };


// // const getDetails = async (req,res) => {
// //   const details = await db.query("SELECT * FROM user_details_view WHERE user_details_view.email = ?", [req.email]);

// //     //*******Get  Preferences*/
// //     const preference = await db.query("SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  Job Type*/
// //     const jobType = await db.query("SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  Job Type*/
// //     const  jpr = await db.query("SELECT job_role FROM job_role_preferences WHERE user_id = ? ",[res.locals.user_id.id]);

// //     //*******Get  Experiences*/
// //     const experience = await db.query("SELECT id, exp FROM experience WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  documents*/
// //     // const document = await db.query("SELECT certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);
// //     const docs = await db.query("SELECT certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  qualifications*/
// //     const qualification = await db.query("SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",[res.locals.user_id.id]);

// //   const job_role_preferences = jpr.map(item => {
// //     console.log(item.job_role.replace(/\\/g, '').replace(/[\[\]"]/g, '').replace(/[{}\/\\]/g, ''))
// //     return item.job_role.replace(/\\/g, '').replace(/[\[\]"]/g, '').replace(/[{}\/\\]/g, '')
// //       // item.job_role = item.job_role
// //       //   .replace(/\\/g, '') // Remove backslashes
// //       //   .replace(/[\[\]"]{}/g, '') // Remove brackets and quotes
// //       //   .trim(); // Remove extra spaces if any
// //     });

// //     const document = docs.map(item => {
// //       return {
// //         certificate: item.certificate,
// //         dbs_on_server: item.dbs_on_server === 0 ? false : true,
// //         dbs_expiry_date: item.dbs_expiry_date,
// //         dbs_serial_number: item.dbs_serial_number,
// //         resume_cv: item.resume_cv
// //       }
// //     });
    

// //     console.log(job_role_preferences)

// //     if (details.length > 0) {
// //       const payload = {
// //         "userDetails":{
// //           details,
// //             preference,
// //             jobType,
// //             job_role_preferences,
// //             experience,
// //             document,
// //             qualification
// //         }
// //       };

// //       return {"details":payload, "code":200};
// //       // res.status(200).json(
// //       //   Response({
// //       //     success: true,
// //       //     message: "Details fetched",
// //       //     data: payload,
// //       //   })
// //       // );
// //     } else {
// //       // const error = userDetails.error.sqlMessage;
// //       // logger("get_user_details").error('SQL Error : ',  {error})
// //       // res.status(422).json(
// //       //   Response({
// //       //     success: false,
// //       //     message: userDetails.error.sqlMessage,
// //       //   })
// //       // );

// //       return false;
// //     }
// // }

// // const getLoginDetails = async (req,res) => {
// //   const details = await db.query("SELECT * FROM user_details_view WHERE user_details_view.email = ?", [req.email]);

// //     //*******Get  Preferences*/
// //     const preference = await db.query("SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  Job Type*/
// //     const jobType = await db.query("SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  Job Type*/
// //     const jpr = await db.query("SELECT id, job_role FROM job_role_preferences WHERE user_id = ? ",[res.locals.user_id.id]);

// //     //*******Get  Experiences*/
// //     const experience = await db.query("SELECT id, exp FROM experience WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  documents*/
// //     // const document = await db.query("SELECT certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);
// //     const docs = await db.query("SELECT certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);

// //     //*******Get  qualifications*/
// //     const qualification = await db.query("SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",[res.locals.user_id.id]);

// //     const job_role_preferences = jpr.map(item => {
// //       console.log(item.job_role.replace(/\\/g, '').replace(/[\[\]"]/g, '').replace(/[{}\/\\]/g, ''))
// //       return item.job_role.replace(/\\/g, '').replace(/[\[\]"]/g, '').replace(/[{}\/\\]/g, '')
// //         // item.job_role = item.job_role
// //         //   .replace(/\\/g, '') // Remove backslashes
// //         //   .replace(/[\[\]"]{}/g, '') // Remove brackets and quotes
// //         //   .trim(); // Remove extra spaces if any
// //       });


// //       const document = docs.map(item => {
// //         return {
// //           certificate: item.certificate,
// //           dbs_on_server: item.dbs_on_server === 0 ? false : true,
// //           dbs_expiry_date: item.dbs_expiry_date,
// //           dbs_serial_number: item.dbs_serial_number,
// //           resume_cv: item.resume_cv
// //         }
// //       });


// //     const access_token = res.locals.tokens


// //       if (details.length > 0) {
// //         const payload = {
// //           "userDetails":{
// //             details,
// //               preference,
// //               jobType,
// //               job_role_preferences,
// //               experience,
// //               document,
// //               qualification,
// //               access_token
// //           }
// //         };

// //       return {"details":payload, "code":200};
// //       // res.status(200).json(
// //       //   Response({
// //       //     success: true,
// //       //     message: "Details fetched",
// //       //     data: payload,
// //       //   })
// //       // );
// //     } else {
// //       // const error = userDetails.error.sqlMessage;
// //       // logger("get_user_details").error('SQL Error : ',  {error})
// //       // res.status(422).json(
// //       //   Response({
// //       //     success: false,
// //       //     message: userDetails.error.sqlMessage,
// //       //   })
// //       // );

// //       return false;
// //     }
// // }

// const getDetails = async (req, res) => {
//   const details = await db.query(
//     "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
//     [req.email]
//   );

//   //*******Get  Preferences*/
//   const preference = await db.query(
//     "SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  Job Type*/
//   const jobType = await db.query(
//     "SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  Job Type*/
//   const jpr = await db.query(
//     "SELECT job_role FROM job_role_preferences WHERE user_id = ? ",
//     [res.locals.user_id.id]
//   );

//   //*******Get  Experiences*/
//   const experience = await db.query(
//     "SELECT id, exp FROM experience WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  documents*/
//   // const document = await db.query("SELECT certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);
//   const docs = await db.query(
//     "SELECT certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv, citizen, right_to_work_doc, right_to_work FROM documents WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  qualifications*/
//   const qualification = await db.query(
//     "SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   const job_role_preferences = jpr.map((item) => {
//     console.log(
//       item.job_role
//         .replace(/\\/g, "")
//         .replace(/[\[\]"]/g, "")
//         .replace(/[{}\/\\]/g, "")
//     );
//     return item.job_role
//       .replace(/\\/g, "")
//       .replace(/[\[\]"]/g, "")
//       .replace(/[{}\/\\]/g, "");
//     // item.job_role = item.job_role
//     //   .replace(/\\/g, '') // Remove backslashes
//     //   .replace(/[\[\]"]{}/g, '') // Remove brackets and quotes
//     //   .trim(); // Remove extra spaces if any
//   });

//   const document = docs.map((item) => {
//     return {
//       certificate: item.certificate,
//       dbs_on_server: item.dbs_on_server === 0 ? false : true,
//       dbs_expiry_date: item.dbs_expiry_date,
//       dbs_serial_number: item.dbs_serial_number,
//       resume_cv: item.resume_cv,
//       citizen: item.citizen === 0 ? false : true,
//       right_to_work_doc: item.right_to_work_doc,
//       right_to_work: item.right_to_work === 0 ? false : true,
//     };
//   });

//   console.log(job_role_preferences);

//   if (details.length > 0) {
//     const payload = {
//       userDetails: {
//         details,
//         preference,
//         jobType,
//         job_role_preferences,
//         experience,
//         document,
//         qualification,
//       },
//     };

//     return { details: payload, code: 200 };
//     // res.status(200).json(
//     //   Response({
//     //     success: true,
//     //     message: "Details fetched",
//     //     data: payload,
//     //   })
//     // );
//   } else {
//     // const error = userDetails.error.sqlMessage;
//     // logger("get_user_details").error('SQL Error : ',  {error})
//     // res.status(422).json(
//     //   Response({
//     //     success: false,
//     //     message: userDetails.error.sqlMessage,
//     //   })
//     // );

//     return false;
//   }
// };

// const getLoginDetails = async (req, res) => {
//   const details = await db.query(
//     "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
//     [req.email]
//   );

//   //*******Get  Preferences*/
//   const preference = await db.query(
//     "SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  Job Type*/
//   const jobType = await db.query(
//     "SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  Job Type*/
//   const jpr = await db.query(
//     "SELECT id, job_role FROM job_role_preferences WHERE user_id = ? ",
//     [res.locals.user_id.id]
//   );

//   //*******Get  Experiences*/
//   const experience = await db.query(
//     "SELECT id, exp FROM experience WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  documents*/
//   // const document = await db.query("SELECT certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);
//   const docs = await db.query(
//     "SELECT certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv, citizen, right_to_work_doc, right_to_work FROM documents WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   //*******Get  qualifications*/
//   const qualification = await db.query(
//     "SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",
//     [res.locals.user_id.id]
//   );

//   const job_role_preferences = jpr.map((item) => {
//     console.log(
//       item.job_role
//         .replace(/\\/g, "")
//         .replace(/[\[\]"]/g, "")
//         .replace(/[{}\/\\]/g, "")
//     );
//     return item.job_role
//       .replace(/\\/g, "")
//       .replace(/[\[\]"]/g, "")
//       .replace(/[{}\/\\]/g, "");
//     // item.job_role = item.job_role
//     //   .replace(/\\/g, '') // Remove backslashes
//     //   .replace(/[\[\]"]{}/g, '') // Remove brackets and quotes
//     //   .trim(); // Remove extra spaces if any
//   });

//   const document = docs.map((item) => {
//     return {
//       certificate: item.certificate,
//       dbs_on_server: item.dbs_on_server === 0 ? false : true,
//       dbs_expiry_date: item.dbs_expiry_date,
//       dbs_serial_number: item.dbs_serial_number,
//       resume_cv: item.resume_cv,
//       citizen: item.citizen === 0 ? false : true,
//       right_to_work_doc: item.right_to_work_doc,
//       right_to_work: item.right_to_work === 0 ? false : true,
//     };
//   });

//   const access_token = res.locals.tokens;

//   if (details.length > 0) {
//     const payload = {
//       userDetails: {
//         details,
//         preference,
//         jobType,
//         job_role_preferences,
//         experience,
//         document,
//         qualification,
//         access_token,
//       },
//     };

//     return { details: payload, code: 200 };
//     // res.status(200).json(
//     //   Response({
//     //     success: true,
//     //     message: "Details fetched",
//     //     data: payload,
//     //   })
//     // );
//   } else {
//     // const error = userDetails.error.sqlMessage;
//     // logger("get_user_details").error('SQL Error : ',  {error})
//     // res.status(422).json(
//     //   Response({
//     //     success: false,
//     //     message: userDetails.error.sqlMessage,
//     //   })
//     // );

//     return false;
//   }
// };

// const getAdminDetails = async (req, res) => {
//   const details = await db.query(
//     "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
//     [req.email]
//   );

//   const access_token = res.locals.tokens;

//   if (details.length > 0) {
//     const payload = {
//       userDetails: {
//         // details,
//         access_token,
//       },
//     };

//     return { details: access_token, code: 200 };
//   } else {

//     return false;
//   }
// };

// const getAllCandidates = async (req, res) => {

//   try {
//     const details = await db.query(
//       `SELECT users.*, certificate, dbs_certificate, dbs_expiry_date, 
//               dbs_serial_number, resume_cv, citizen, right_to_work_doc, 
//               right_to_work, edited_cv
//       FROM users
//       LEFT JOIN documents ON users.id = documents.user_id
//       WHERE users.user_type = ?
//       ORDER BY users.id DESC
//       LIMIT 10 OFFSET ?`,
//       ["Candidate", (req.query.page - 1) * 10 || 0]
//     );

//     console.log(details);

//     // res.json({ success: true, data: details });

//     return details;
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// const getAllClients = async (req, res) => {
//   // try {
//   //   const details = await db.query(
//   //     `SELECT * FROM users 
//   //      WHERE user_type = ? AND achieved = ? 
//   //      ORDER BY id DESC 
//   //      LIMIT 10 OFFSET ?`,
//   //     ["Client", 0 ,(req.query.page - 1) * 10 || 0]
//   //   );

//   //   // res.json({ success: true, data: details });

//   //   return details;
//   // } catch (error) {
//   //   console.error(error);
//   //   res.status(500).json({ success: false, message: "Server Error" });
//   // }

//   try {
//     const offset = (parseInt(req.query.page) - 1) * 10 || 0;

//     const rows = await db.query(
//       `SELECT * FROM users 
//       WHERE user_type = ? AND achieved = ? 
//       ORDER BY id DESC 
//       LIMIT 10 OFFSET ?`,
//       ["Client", 0, offset]
//     );

//     // Transform: hash id and remove password
//     const clients = rows.map((user) => {
//       const { password, ...rest } = user; // remove password
//       return {
//         ...rest,
//         id: encryptId(user.id), // hash id
//       };
//     });

//     // res.json({ success: true, data: clients });

//     return clients
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// const getSingleClients = async (req, res) => {
//   try {
//     const details = await db.query(
//       `SELECT * FROM users 
//       WHERE user_type = ? AND id = ?`,
//       ["Client", decryptId(req.body.id)]
//     );

//     // Transform: hash id and remove password
//     const clients = details.map((user) => {
//       const { password, ...rest } = user; // remove password
//       return {
//         ...rest,
//         id: encryptId(user.id), // hash id
//       };
//     });

//     // res.json({ success: true, data: details });

//     return clients;
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// const deleteClients = async (req, res) => {
//   try {
//     const details = await db.query(
//       `UPDATE users SET achieved = ? 
//       WHERE user_type = ? AND id = ?`,
//       [1,"Client", decryptId(req.body.id)]
//     );

//     // const details = await db.query(
//     //   `SELECT * FROM users 
//     //    WHERE user_type = ? AND achieved = ? 
//     //    ORDER BY id DESC 
//     //    LIMIT 10 OFFSET ?`,
//     //   ["Client", 0 ,(req.query.page - 1) * 10 || 0]
//     // );

//     // res.json({ success: true, data: details });

//     return details;
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// const bringBackClients = async (req, res) => {
//   try {
//     const details = await db.query(
//       `UPDATE users SET achieved = ? 
//       WHERE user_type = ? AND id = ?`,
//       [0,"Client", decryptId(req.body.id)]
//     );

//     // const details = await db.query(
//     //   `SELECT * FROM users 
//     //    WHERE user_type = ? AND achieved = ? 
//     //    ORDER BY id DESC 
//     //    LIMIT 10 OFFSET ?`,
//     //   ["Client", 0 ,(req.query.page - 1) * 10 || 0]
//     // );

//     // res.json({ success: true, data: details });

//     return details;
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// module.exports = { getDetails, getLoginDetails, getAdminDetails, getAllCandidates , getAllClients, getSingleClients, deleteClients, bringBackClients };

const { access } = require("fs-extra");
const db = require("../db/connection_new.js");
const crypto = require("crypto");

const secret = crypto.randomBytes(32);

// Encrypt
const encryptId = (id) => {
  const cipher = crypto.createCipheriv("aes-256-ctr", secret, Buffer.alloc(16, 0));
  return Buffer.concat([cipher.update(String(id)), cipher.final()]).toString("hex");
};

// Decrypt
const decryptId = (encrypted) => {
  const decipher = crypto.createDecipheriv("aes-256-ctr", secret, Buffer.alloc(16, 0));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]).toString();
};

const getDetails = async (req, res) => {
  const details = await db.query(
    "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
    [req.email]
  );

  //*******Get  Preferences*/
  const preference = await db.query(
    "SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  Job Type*/
  const jobType = await db.query(
    "SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  Job Type*/
  const jpr = await db.query(
    "SELECT job_role FROM job_role_preferences WHERE user_id = ? ",
    [res.locals.user_id.id]
  );

  //*******Get  Experiences*/
  const experience = await db.query(
    "SELECT id, exp FROM experience WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  documents*/
  // const document = await db.query("SELECT certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);
  const docs = await db.query(
    "SELECT certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv, citizen, right_to_work_doc, right_to_work FROM documents WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  qualifications*/
  const qualification = await db.query(
    "SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  const job_role_preferences = jpr.map((item) => {
    console.log(
      item.job_role
        .replace(/\\/g, "")
        .replace(/[\[\]"]/g, "")
        .replace(/[{}\/\\]/g, "")
    );
    return item.job_role
      .replace(/\\/g, "")
      .replace(/[\[\]"]/g, "")
      .replace(/[{}\/\\]/g, "");
    // item.job_role = item.job_role
    //   .replace(/\\/g, '') // Remove backslashes
    //   .replace(/[\[\]"]{}/g, '') // Remove brackets and quotes
    //   .trim(); // Remove extra spaces if any
  });

  const document = docs.map((item) => {
    return {
      certificate: item.certificate,
      dbs_on_server: item.dbs_on_server === 0 ? false : true,
      dbs_expiry_date: item.dbs_expiry_date,
      dbs_serial_number: item.dbs_serial_number,
      resume_cv: item.resume_cv,
      citizen: item.citizen === 0 ? false : true,
      right_to_work_doc: item.right_to_work_doc,
      right_to_work: item.right_to_work === 0 ? false : true,
    };
  });

  console.log(job_role_preferences);

  if (details.length > 0) {
    const payload = {
      userDetails: {
        details,
        preference,
        jobType,
        job_role_preferences,
        experience,
        document,
        qualification,
      },
    };

    return { details: payload, code: 200 };
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
};

const getLoginDetails = async (req, res) => {
  const details = await db.query(
    "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
    [req.email]
  );

  //*******Get  Preferences*/
  const preference = await db.query(
    "SELECT full_time, part_time, term_time, after  FROM preferences WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  Job Type*/
  const jobType = await db.query(
    "SELECT permanent, temporary, bookings FROM job_types WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  Job Type*/
  const jpr = await db.query(
    "SELECT id, job_role FROM job_role_preferences WHERE user_id = ? ",
    [res.locals.user_id.id]
  );

  //*******Get  Experiences*/
  const experience = await db.query(
    "SELECT id, exp FROM experience WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  documents*/
  // const document = await db.query("SELECT certificate, dbs_certificate, dbs_expiry_date, resume_cv FROM documents WHERE user_id = ?", [res.locals.user_id.id]);
  const docs = await db.query(
    "SELECT certificate, dbs_on_server, dbs_expiry_date, dbs_serial_number, resume_cv, citizen, right_to_work_doc, right_to_work FROM documents WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  //*******Get  qualifications*/
  const qualification = await db.query(
    "SELECT id, qualification_type, upload_doc FROM qualifications WHERE user_id = ?",
    [res.locals.user_id.id]
  );

  const job_role_preferences = jpr.map((item) => {
    console.log(
      item.job_role
        .replace(/\\/g, "")
        .replace(/[\[\]"]/g, "")
        .replace(/[{}\/\\]/g, "")
    );
    return item.job_role
      .replace(/\\/g, "")
      .replace(/[\[\]"]/g, "")
      .replace(/[{}\/\\]/g, "");
    // item.job_role = item.job_role
    //   .replace(/\\/g, '') // Remove backslashes
    //   .replace(/[\[\]"]{}/g, '') // Remove brackets and quotes
    //   .trim(); // Remove extra spaces if any
  });

  const document = docs.map((item) => {
    return {
      certificate: item.certificate,
      dbs_on_server: item.dbs_on_server === 0 ? false : true,
      dbs_expiry_date: item.dbs_expiry_date,
      dbs_serial_number: item.dbs_serial_number,
      resume_cv: item.resume_cv,
      citizen: item.citizen === 0 ? false : true,
      right_to_work_doc: item.right_to_work_doc,
      right_to_work: item.right_to_work === 0 ? false : true,
    };
  });

  const access_token = res.locals.tokens;

  if (details.length > 0) {
    const payload = {
      userDetails: {
        details,
        preference,
        jobType,
        job_role_preferences,
        experience,
        document,
        qualification,
        access_token,
      },
    };

    return { details: payload, code: 200 };
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
};

const getAdminDetails = async (req, res) => {
  const details = await db.query(
    "SELECT * FROM user_details_view WHERE user_details_view.email = ?",
    [req.email]
  );

  const access_token = res.locals.tokens;

  if (details.length > 0) {
    const payload = {
      userDetails: {
        details,
        access_token,
      },
    };

    return { details: payload, code: 200 };
  } else {

    return false;
  }
};

const getAllCandidates = async (req, res) => {

  try {
    const details = await db.query(
      `SELECT users.*, certificate, dbs_certificate, dbs_expiry_date, 
              dbs_serial_number, resume_cv, citizen, right_to_work_doc, 
              right_to_work, edited_cv
       FROM users
       LEFT JOIN documents ON users.id = documents.user_id
       WHERE users.user_type = ?
       ORDER BY users.id DESC`,
      ["Candidate"]
    );

    console.log(details);

    // res.json({ success: true, data: details });

    return details;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllClients = async (req, res) => {
  // try {
  //   const details = await db.query(
  //     `SELECT * FROM users 
  //      WHERE user_type = ? AND achieved = ? 
  //      ORDER BY id DESC 
  //      LIMIT 10 OFFSET ?`,
  //     ["Client", 0 ,(req.query.page - 1) * 10 || 0]
  //   );

  //   // res.json({ success: true, data: details });

  //   return details;
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ success: false, message: "Server Error" });
  // }

  try {
    const offset = (parseInt(req.query.page) - 1) * 10 || 0;

    const rows = await db.query(
      `SELECT * FROM users 
       WHERE user_type = ? AND achieved = ? 
       ORDER BY id DESC`,
      ["Client", 0]
    );

    // Transform: hash id and remove password
    const clients = rows.map((user) => {
      const { password, ...rest } = user; // remove password
      return {
        ...rest,
        id: user.id, // hash id
      };
    });

    // res.json({ success: true, data: clients });

    return clients
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSingleClients = async (req, res) => {
  try {
    const details = await db.query(
      `SELECT * FROM users 
       WHERE user_type = ? AND id = ?`,
      ["Client", req.body.id]
    );

    // Transform: hash id and remove password
    const clients = details.map((user) => {
      const { password, ...rest } = user; // remove password
      return {
        ...rest,
        id: user.id, // hash id
      };
    });

    // res.json({ success: true, data: details });

    return clients;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteClients = async (req, res) => {
  try {
    const details = await db.query(
      `UPDATE users SET achieved = ? 
       WHERE user_type = ? AND id = ?`,
      [1,"Client", req.body.id]
    );

    // const details = await db.query(
    //   `SELECT * FROM users 
    //    WHERE user_type = ? AND achieved = ? 
    //    ORDER BY id DESC 
    //    LIMIT 10 OFFSET ?`,
    //   ["Client", 0 ,(req.query.page - 1) * 10 || 0]
    // );

    // res.json({ success: true, data: details });

    return details;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const bringBackClients = async (req, res) => {
  try {
    const details = await db.query(
      `UPDATE users SET achieved = ? 
       WHERE user_type = ? AND id = ?`,
      [0,"Client", req.body.id]
    );

    // const details = await db.query(
    //   `SELECT * FROM users 
    //    WHERE user_type = ? AND achieved = ? 
    //    ORDER BY id DESC 
    //    LIMIT 10 OFFSET ?`,
    //   ["Client", 0 ,(req.query.page - 1) * 10 || 0]
    // );

    // res.json({ success: true, data: details });

    return details;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getDetails, getLoginDetails, getAdminDetails, getAllCandidates , getAllClients, getSingleClients, deleteClients, bringBackClients };
