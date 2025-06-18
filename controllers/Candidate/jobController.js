const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {
  fetchAllJobs,
  fetchAJob,
  fetchJobApplications,
  fetchJobApplicationsStatus,
  fetchJobDays,
  fetchCompanyImage,
  fetchAcceptedDate,
} = require("../../models/jobModel.js");
const { Email, ApplicationEmail ,SMS } = require("../../middlewares/notificationMiddleware.js");
const {
  addInitialJobDaySession,
  addJobCompleted,
} = require("./avalController.js");
const {
  fetchSession,
  fetchASession,
  fetchSessionPaySlip,
} = require("../../middlewares/availabilityMiddleware.js");
const { serviceCharge } = require("../../utils/custom_function.js");

const fetchAll = async (req, res) => {
  try {
    const touch = await fetchAllJobs(req, res);

    if (touch !== false) {
      res.status(201).json(
        Response({
          success: true,
          message: "Job fetched",
          data: touch,
        })
      );
    } else {
      res.status(422).json(
        Response({
          success: false,
          message: "Failed to fetch jobs",
        })
      );
    }
  } catch (error) {
    logger("fetch_all_job").error("Job Fetch : ", `${error}`);
    res.status(422).json(
      Response({
        success: false,
        message: `System error - ${error}`,
      })
    );
  }
};

const fetch = async (req, res) => {
  try {
    const touch = await fetchAJob(req, res);
    console.log("touch : ", touch);
    if (touch.length > 0) {
      res.status(201).json(
        Response({
          success: true,
          message: "Job fetched",
          data: touch,
        })
      );
    } else {
      res.status(404).json(
        Response({
          success: false,
          message: "No Job found",
          data: touch,
        })
      );
    }
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);
    res.status(422).json(
      Response({
        success: false,
        message: `System error - ${error}`,
      })
    );
  }
};

// const apply = async (req, res, route) => {
//   try {
//     //******check if the job exists */
//     const jobCheck = await db.query(
//       "SELECT id,job_title, roles FROM posted_jobs WHERE id = ? AND company = ?",
//       [req.body.job_id, req.body.company_id]
//     );

//     if (jobCheck.length > 0) {
//       const applyCheck = await db.query(
//         "SELECT candidate FROM applications WHERE candidate = ? AND job = ?",
//         [res.locals.user_id.id, req.body.job_id]
//       );

//       if (applyCheck.length > 0) {
//         res.status(422).json(
//           Response({
//             success: false,
//             message: `Sorry you have already applied for this job`,
//           })
//         );
//       } else {
//         const left = jobCheck[0].roles - 1;
//         //insert job days_sessions
//         // first fetch job days_sessions
//         const days_sessions = await fetchASession(req.body.job_id);
//         const sessions = days_sessions.days;
//         if (sessions.length > 0) {
//           console.log("days_sessions : ", days_sessions);
//           //insert initial values for the days_sessions
//           addJobCompleted(days_sessions, res);

//           const sql =
//             "INSERT INTO applications(candidate, job, company) VALUES(?,?,?)";
//           const values = [
//             res.locals.user_id.id,
//             req.body.job_id,
//             req.body.company_id,
//           ];
//           const insert = await db.query(sql, values);

//           if (insert.affectedRows > 0) {
//             const touch = await fetchJobApplications(req, res);
//             let message;

//             //******check which route is the request coming from */
//             if (route === "application") {
//               //*****send a notification via mail or sms for the applied job
//               message = `Dear ${res.locals.full_name}, <br/> <br/> 
//               <p>Thank you for submitting your application for the position of ${jobCheck[0].job_title} (Reference Number: ${req.body.job_id}) via our Jobtion.<br/></p>
//               <p>We confirm receipt of your application and appreciate your interest in joining our team. Our consultants are currently reviewing applications and will be in touch with you within the next 5 working days regarding the next steps.<br/></p>
//               <p>Please expect a phone call if successful.</p>
//               <p>If you have any questions in the meantime, please feel free to reach out to us at info@quinteducation.co.uk or contact Direct Tel: 0207 11 88 99 4.<br/></p>
//               <p>Thank you once again for applying, and we wish you the best of luck.<br/></p>
//               Kind regards,<br/><br/>
//               Quint Education`;

              

//               await db.query("UPDATE posted_jobs SET roles = ? WHERE id = ? ",[left, req.body.job_id]);
//             }
//             else{
//               message = `Dear ${res.locals.full_name}, <br/> <br/> 
//               <p>Thank you for accepting the application for the position of ${jobCheck[0].job_title} (Reference Number: ${req.body.job_id}) through our platform, Jobtion.<br/></p>
//               <p>If you have any questions or require further assistance, please do not hesitate to contact us at info@quinteducation.co.uk or contact Direct Tel: 0207 11 88 99 4. We are here to support you throughout the recruitment process.<br/></p>
//               <p></p>
//               <p>Thank you once again, and we wish you the very best of luck in this opportunity.<br/></p>
//               Kind regards,<br/><br/>
//               Quint Education`;

//               const message_ = `Candidate ${res.locals.full_name}, <br/> <br/> 
//               <p>Accepted Job position : ${jobCheck[0].job_title}  via our Jobtion.<br/></p>
//               <p></p>`;

//               await db.query("UPDATE bookings SET candidate_status = ?, booking_status = ? WHERE candidate = ? AND job = ?",["accepted", "accepted", res.locals.user_id.id, req.body.job_id]);
//               await db.query("UPDATE posted_jobs SET roles = ? WHERE id = ? ",[left, req.body.job_id]);
//               Email("duffy@quinteducation.co.uk", message_, jobCheck[0].job_title);
//             }
            
              

//               ApplicationEmail(req.email, message, jobCheck[0].job_title);

//             //***store booking logs */
//             const pickCompanyDetails = await db.query(
//               "SELECT company_name FROM users WHERE id = ?",
//               [req.body.company_id]
//             );
//             await db.query(
//               "INSERT INTO admin_data_logs(full_name,email,activity) VALUES(?,?,?)",
//               [
//                 res.locals.full_name,
//                 req.email,
//                 `Applied for job : ${jobCheck[0].job_title} under company : ${pickCompanyDetails[0].company_name} with status pending`,
//               ]
//             );

//             res.status(201).json(
//               Response({
//                 success: true,
//                 message: "Job Applied",
//                 data: touch,
//               })
//             );
//           } else {
//             logger("apply_a_job").error("Job Application : ", `${error}`);
//             res.status(422).json(
//               Response({
//                 success: false,
//                 message: `Error - ${insert}`,
//               })
//             );
//           }
//         } else {
//           res.status(422).json(
//             Response({
//               success: false,
//               message: `Can't apply for this job, please contact the admin`,
//               data: [],
//             })
//           );
//         }
//       }
//     } else {
//       res.status(404).json(
//         Response({
//           success: false,
//           message: `No posted job found for this job title with this company`,
//           data: [],
//         })
//       );
//     }
//   } catch (error) {
//     logger("apply_a_job").error("Job Application : ", `${error}`);
//     res.status(422).json(
//       Response({
//         success: false,
//         message: `System error - ${error}`,
//       })
//     );
//   }
// };

const apply = async (req, res, route) => {
  try {
    //******check if the job exists */
    const jobCheck = await db.query(
      "SELECT id,job_title, roles, job_type FROM posted_jobs WHERE id = ? AND company = ?",
      [req.body.job_id, req.body.company_id]
    );

    if (jobCheck.length > 0) {
      const applyCheck = await db.query(
        "SELECT candidate FROM applications WHERE candidate = ? AND job = ? AND status != ?",
        [res.locals.user_id.id, req.body.job_id, "completed"]
      );

      if (applyCheck.length > 0) {
        res.status(422).json(
          Response({
            success: false,
            message: `Sorry you have already applied for this job`,
          })
        );
      } else {
        const left = jobCheck[0].roles - 1;

        // first fetch job days_sessions
        const days_sessions = await fetchASession(req.body.job_id);
        const sessions = days_sessions.days;

        if (sessions.length > 0 && jobCheck[0].job_type === "Temporary") {
          console.log("days_sessions : ", days_sessions);
          //insert initial values for the days_sessions
          addJobCompleted(days_sessions, res);

          const sql ="INSERT INTO applications(candidate, job, company, type) VALUES(?,?,?,?)";
          const values = [
            res.locals.user_id.id,
            req.body.job_id,
            req.body.company_id,
            "booking",
          ];
          const insert = await db.query(sql, values);

          route = "booking";

          if (insert.affectedRows > 0) {
            let message;

            //******check which route is the request coming from */
            if (route === "booking") {
              //*****send a notification via mail or sms for the applied job
               message = `Dear ${res.locals.full_name}, <br/> <br/> 
              <p>Thank you for submitting your application for the position of ${jobCheck[0].job_title} (Reference Number: ${req.body.job_id}) via our Jobtion.<br/></p>
              <p>We confirm receipt of your application and appreciate your interest in joining our team. Our consultants are currently reviewing applications and will be in touch with you within the next 5 working days regarding the next steps.<br/></p>
              <p>Please expect a phone call if successful.</p>
              <p>If you have any questions in the meantime, please feel free to reach out to us at info@quinteducation.co.uk or contact Direct Tel: 0207 11 88 99 4.<br/></p>
              <p>Thank you once again for applying, and we wish you the best of luck.<br/></p>
              Kind regards,<br/><br/>
              Quint Education`;

              

              await db.query("UPDATE posted_jobs SET roles = ? WHERE id = ? ",[left, req.body.job_id]);
            }
            else{
              message = `Dear ${res.locals.full_name}, <br/> <br/> 
              <p>Thank you for accepting the application for the position of ${jobCheck[0].job_title} (Reference Number: ${req.body.job_id}) through our platform, Jobtion.<br/></p>
              <p>If you have any questions or require further assistance, please do not hesitate to contact us at info@quinteducation.co.uk or contact Direct Tel: 0207 11 88 99 4. We are here to support you throughout the recruitment process.<br/></p>
              <p></p>
              <p>Thank you once again, and we wish you the very best of luck in this opportunity.<br/></p>
              Kind regards,<br/><br/>
              Quint Education`;

              const message_ = `Candidate ${res.locals.full_name}, <br/> <br/> 
              <p>Accepted Job position : ${jobCheck[0].job_title}  via our Jobtion.<br/></p>
              <p></p>`;

               await db.query("UPDATE bookings SET candidate_status = ?, booking_status = ? WHERE candidate = ? AND job = ?",["accepted", "accepted", res.locals.user_id.id, req.body.job_id]);
               await db.query("UPDATE posted_jobs SET roles = ? WHERE id = ? ",[left, req.body.job_id]);
               Email("francislartey12@gmail.com", message_, jobCheck[0].job_title);
            }

              ApplicationEmail(req.email, message, jobCheck[0].job_title);

            //***store booking logs */
            const pickCompanyDetails = await db.query(
              "SELECT company_name FROM users WHERE id = ?",
              [req.body.company_id]
            );
            await db.query("INSERT INTO admin_data_logs(full_name,email,activity) VALUES(?,?,?)",
              [
                res.locals.full_name,
                req.email,
                `Applied for job : ${jobCheck[0].job_title} under company : ${pickCompanyDetails[0].company_name} with status pending`,
              ]
            );
            const touch = await fetchJobApplications(req, res);
            
            res.status(201).json(
              Response({
                success: true,
                message: "Job Applied",
                data: touch,
              })
            );
          } else {
            logger("apply_a_job").error("Job Application : ", `${error}`);
            res.status(422).json(
              Response({
                success: false,
                message: `Error - ${insert}`,
              })
            );
          }
        } else {

          if (jobCheck[0].job_type === "Permanent") {
            const sql ="INSERT INTO applications(candidate, job, company, type) VALUES(?,?,?,?)";
            const values = [
              res.locals.user_id.id,
              req.body.job_id,
              req.body.company_id,
              "permanent",
            ];
            const insert = await db.query(sql, values);

            if (insert.affectedRows > 0) {
              let message;

                //*****send a notification via mail or sms for the applied job
                message = `Dear ${res.locals.full_name}, <br/> <br/> 
                <p>Thank you for submitting your application for the position of ${jobCheck[0].job_title} (Reference Number: ${req.body.job_id}) via our Jobtion.<br/></p>
                <p>We confirm receipt of your application and appreciate your interest in joining our team. Our consultants are currently reviewing applications and will be in touch with you within the next 5 working days regarding the next steps.<br/></p>
                <p>Please expect a phone call if successful.</p>
                <p>If you have any questions in the meantime, please feel free to reach out to us at info@quinteducation.co.uk or contact Direct Tel: 0207 11 88 99 4.<br/></p>
                <p>Thank you once again for applying, and we wish you the best of luck.<br/></p>
                Kind regards,<br/><br/>
                Quint Education`;

                

                await db.query("UPDATE posted_jobs SET roles = ? WHERE id = ? ",[left, req.body.job_id]);

                ApplicationEmail(req.email, message, jobCheck[0].job_title);

              //***store booking logs */
              const pickCompanyDetails = await db.query(
                "SELECT company_name FROM users WHERE id = ?",
                [req.body.company_id]
              );
              await db.query( "INSERT INTO admin_data_logs(full_name,email,activity) VALUES(?,?,?)",
                [
                  res.locals.full_name,
                  req.email,
                  `Applied for job : ${jobCheck[0].job_title} under company : ${pickCompanyDetails[0].company_name} with status pending`,
                ]
              );
              //***fetch the jobs */
              const touch = await fetchJobApplications(req, res);

              res.status(201).json(
                Response({
                  success: true,
                  message: "Job Applied",
                  data: touch,
                })
              );
            } else {
              logger("apply_a_job").error("Job Application : ", `${error}`);
              res.status(422).json(
                Response({
                  success: false,
                  message: `Error - ${insert}`,
                })
              );
            }
          } else {
            console.log(jobCheck[0].job_type)
            res.status(422).json(
            Response({
              success: false,
              message: `There was an error processing your request, please try again later`,
              data: [],
            })
          );
          }
        }
      }
    } else {
      res.status(404).json(
        Response({
          success: false,
          message: `No posted job found for this job title with this company`,
          data: [],
        })
      );
    }
  } catch (error) {
    logger("apply_a_job").error("Job Application : ", `${error}`);
    res.status(422).json(
      Response({
        success: false,
        message: `System error - ${error}`,
      })
    );
  }
};

const fetchApplyJob = async (req, res) => {
  try {
    //******check if the job exists */
    const jobCheck = await db.query(
      "SELECT id FROM applications WHERE candidate = ?",
      [res.locals.user_id.id]
    );

    if (jobCheck.length > 0) {
      const touch = await fetchJobApplicationsStatus(req, res);
      res.status(201).json(
        Response({
          success: true,
          message: "Job Fetched",
          data: touch,
        })
      );
    } else {
      res.status(422).json(
        Response({
          success: false,
          message: `No application found`,
          data: [],
        })
      );
    }
  } catch (error) {
    logger("apply_a_job").error("Job Application : ", `${error}`);
    res.status(422).json(
      Response({
        success: false,
        message: `System error - ${error}`,
      })
    );
  }
};

// const payslip = async (req, res) => {
//   try {
//     const { start_date , end_date } = req.query;

//     if (!start_date || !end_date) {
//       return res.status(400).json(
//         Response({
//           success: false,
//           message: "Start date and end date are required.",
//         })
//       );
//     }

//     const sql = `
//       SELECT cj.id, cj.job_id, cj.updated_at, pj.job_title, pj.amount, pj.hours, pj.company
//       FROM completed_job AS cj
//       LEFT JOIN posted_jobs AS pj ON cj.job_id = pj.id
//       WHERE cj.user_id = ? 
//         AND cj.status = ? 
//         AND cj.updated_at BETWEEN ? AND ?
//       GROUP BY cj.job_id
//     `;

//     const fetch = await db.query(sql, [
//       res.locals.user_id.id,
//       1,
//       start_date,
//       end_date,
//     ]);

//     const jobs = await Promise.all(
//       fetch.map(async (job) => {
//         const subTotal = job.amount * job.hours;

//         const days = await fetchSessionPaySlip(job.job_id, job.amount, job.hours);
//         const company_image = await fetchCompanyImage(job.company);
//         const accepted_date = await fetchAcceptedDate(
//           job.job_id,
//           res.locals.user_id.id
//         );

//         return {
//           job_title: job.job_title ?? "",
//           job_image: company_image,
//           date_accepted: accepted_date,
//           date_completed: job.updated_at ?? "",
//           job_hours: job.hours ? parseFloat(job.hours) : 0,
//           job_amount: job.amount ? parseFloat(job.amount) : 0,
//           days_on_duty: {
//             days,
//             total: {
//               subtotal: subTotal,
//               service_charge: serviceCharge(subTotal),
//               grand_total: subTotal - serviceCharge(subTotal),
//             },
//           },
//         };
//       })
//     );

//     // Create a key based on the date range
//     const rangeKey = `${start_date} to ${end_date}`;
//     const responseData = {
//       [rangeKey]: jobs,
//     };

//     res.status(200).json(
//       Response({
//         success: true,
//         message: `Fetched PaySlip for ${rangeKey}`,
//         data: responseData,
//       })
//     );
//   } catch (error) {
//     logger("get-payslip").error("PaySlipByDateRange : ", `${error}`);
//     res.status(422).json(
//       Response({
//         success: false,
//         message: `System error - ${error}`,
//       })
//     );
//   }
// };

// const payslip = async (req, res) => {
//   try {
//     const { start_date, end_date } = req.query;

//     if (!start_date || !end_date) {
//       return res.status(422).json(
//         Response({
//           success: false,
//           message: "Start date and end date are required.",
//         })
//       );
//     }

//     // Check that the range is exactly 7 days
//     const start = new Date(start_date);
//     const end = new Date(end_date);
//     const timeDiff = end.getTime() - start.getTime();
//     const dayDiff = timeDiff / (1000 * 3600 * 24);

//     console.log(dayDiff);

//     if (dayDiff !== 6) {
//       return res.status(422).json(
//         Response({
//           success: false,
//           message:
//             "Date range must be exactly one week (7 days, including start and end).",
//         })
//       );
//     }

//     const sql = `
//   SELECT 
//     ps.id, 
//     ps.job_id, 
//     ps.end, 
//     SUM(ps.subtotal) AS subtotal, 
//     pj.job_title, 
//     pj.amount, 
//     ps.company_id
//   FROM payslip AS ps
//   LEFT JOIN posted_jobs AS pj ON ps.job_id = pj.id
//   WHERE ps.candidate_id = ?
//     AND ps.break_time_updated = ?
//     AND DATE(ps.end) BETWEEN ? AND ?
//   GROUP BY ps.job_id
// `;

//     const fetch = await db.query(sql, [
//       res.locals.user_id.id,
//       2,
//       start_date,
//       end_date,
//     ]);

//     const jobs = await Promise.all(
//       fetch.map(async (job) => {
//         const subTotal = job.subtotal ? parseFloat(job.subtotal) : 0;
//         const days = await fetchSessionPaySlip(job.job_id, subTotal);
//         const company_image = await fetchCompanyImage(job.company_id);
//         const accepted_date = await fetchAcceptedDate(
//           job.job_id,
//           res.locals.user_id.id
//         );

//         return {
//           job_title: job.job_title ?? "",
//           job_image: company_image,
//           date_accepted: accepted_date,
//           date_completed: job.end ?? "",
//           payment_per_hour: job.amount ? parseFloat(job.amount) : 0,
//           days_on_duty: {
//             days,
//             total: {
//               subtotal: subTotal,
//               service_charge: serviceCharge(subTotal),
//               grand_total: subTotal - serviceCharge(subTotal),
//             },
//           },
//         };
//       })
//     );

//     const rangeKey = `${start_date} to ${end_date}`;
//     const responseData = {
//       [rangeKey]: jobs,
//     };

//     res.status(200).json(
//       Response({
//         success: true,
//         message: `Fetched weekly payslip for ${rangeKey}`,
//         data: responseData,
//       })
//     );
//   } catch (error) {
//     logger("get-payslip").error("payslipWeekly : ", `${error}`);
//     res.status(422).json(
//       Response({
//         success: false,
//         message: `System error - ${error}`,
//       })
//     );
//   }
// };


// const payslip = async (req, res) => {
//   try {
//     const { start_date, end_date } = req.query;

//     let fetch_all;

//     if (!start_date || !end_date) {
//       fetch_all = true;
//       // return res.status(422).json(
//       //   Response({
//       //     success: false,
//       //     message: "Start date and end date are required.",
//       //   })
//       // );
//     }

//     // Check that the range is exactly 7 days
//     const start = new Date(start_date);
//     const end = new Date(end_date);
//     const timeDiff = end.getTime() - start.getTime();
//     const dayDiff = timeDiff / (1000 * 3600 * 24);


//     // if (dayDiff !== 6) {
//     //   return res.status(422).json(
//     //     Response({
//     //       success: false,
//     //       message:
//     //         "Date range must be exactly one week (7 days, including start and end).",
//     //     })
//     //   );
//     // }
//     let sql;
//     if (fetch_all) {
//       sql = `
//       SELECT 
//         ps.id, 
//         ps.job_id, 
//         ps.end, 
//         SUM(ps.subtotal) AS subtotal, 
//         pj.job_title,
//         pj.location,
//         pj.amount, 
//         ps.company_id
//       FROM payslip AS ps
//       LEFT JOIN posted_jobs AS pj ON ps.job_id = pj.id
//       WHERE ps.candidate_id = ?
//         AND ps.break_time_updated = ?
//       GROUP BY ps.job_id ORDER BY ps.updated_at DESC LIMIT 10
//     `;
//     }
//     else{
//       sql = `
//       SELECT 
//         ps.id, 
//         ps.job_id, 
//         ps.end, 
//         SUM(ps.subtotal) AS subtotal, 
//         pj.job_title,
//         pj.location,
//         pj.amount, 
//         ps.company_id
//       FROM payslip AS ps
//       LEFT JOIN posted_jobs AS pj ON ps.job_id = pj.id
//       WHERE ps.candidate_id = ?
//         AND ps.break_time_updated = ?
//         AND DATE(ps.end) BETWEEN ? AND ?
//       GROUP BY ps.job_id ORDER BY ps.updated_at DESC
//     `;
//     }

   

//     let fetch;

//     if (fetch_all) {
//       fetch = await db.query(sql, [
//         res.locals.user_id.id,
//         2,
//       ]);
//     }
//     else{
//       fetch = await db.query(sql, [
//         res.locals.user_id.id,
//         2,
//         start_date,
//         end_date,
//       ]);
//     }

//     const jobs = await Promise.all(
//       fetch.map(async (job) => {
//         const subTotal = job.subtotal ? parseFloat(job.subtotal) : 0;
//         const days = await fetchSessionPaySlip(job.job_id, subTotal);
//         const company_image = await fetchCompanyImage(job.company_id);
//         const accepted_date = await fetchAcceptedDate(
//           job.job_id,
//           res.locals.user_id.id
//         );

//         return {
//           job_title: job.job_title ?? "",
//           job_location: job.location ?? "",
//           job_image: company_image,
//           date_accepted: accepted_date,
//           date_completed: job.end ?? "",
//           payment_per_hour: job.amount ? parseFloat(job.amount) : 0,
//           days_on_duty: {
//             days,
//             total: {
//               subtotal: subTotal,
//               service_charge: serviceCharge(subTotal),
//               grand_total: subTotal - serviceCharge(subTotal),
//             },
//           },
//         };
//       })
//     );

//     const rangeKey = `${start_date} to ${end_date}`;
//     const responseData = {
//       [ fetch_all ? "latest 10" : rangeKey]: jobs,
//     };

//     res.status(200).json(
//       Response({
//         success: true,
//         message: `Fetched payslip for  ${ fetch_all ? "latest 10" : `${rangeKey}`}`,
//         data: responseData,
//       })
//     );
//   } catch (error) {
//     logger("get-payslip").error("payslipWeekly : ", `${error}`);
//     res.status(422).json(
//       Response({
//         success: false,
//         message: `System error - ${error}`,
//       })
//     );
//   }
// };

const payslip = async (req, res) => {
  try {
        const { start_date, end_date } = req.query;

    let fetch_all;

    if (!start_date || !end_date) {
      fetch_all = true;
      // return res.status(422).json(
      //   Response({
      //     success: false,
      //     message: "Start date and end date are required.",
      //   })
      // );
    }

    console.log("fetch ", fetch_all);

    let sql;
    if(fetch_all) {
      sql = `
      SELECT cj.id, cj.job_id, cj.updated_at, cj.subtotal AS subtotal, pj.location, pj.job_title, pj.amount, pj.hours, pj.company
      FROM completed_job AS cj
      LEFT JOIN posted_jobs AS pj ON cj.job_id = pj.id
      WHERE cj.user_id = ?
        AND cj.status = ?
      GROUP BY cj.job_id
      ORDER BY cj.updated_at DESC
      
    `;
    }
    else{
      sql = `
      SELECT cj.id, cj.job_id, cj.updated_at, cj.subtotal AS subtotal, pj.location, pj.job_title, pj.amount, pj.hours, pj.company
      FROM completed_job AS cj
      LEFT JOIN posted_jobs AS pj ON cj.job_id = pj.id
      WHERE cj.user_id = ?
        AND cj.status = ?
         And DATE(cj.updated_at) BETWEEN ? AND ?
      GROUP BY cj.job_id
      ORDER BY cj.updated_at DESC
      LIMIT 10
    `;
    }

    let fetch;

    if (fetch_all) {
      fetch = await db.query(sql, [
        res.locals.user_id.id,
        1,
      ]);
    }
    else{
      fetch = await db.query(sql, [
        res.locals.user_id.id,
        1,
        start_date,
        end_date,
      ]);
    }

    const jobs = await Promise.all(
      fetch.map(async (job) => {
        // const subTotal =  job.amount * job.hours;
        console.log("job.amount : ", job.amount);
        // const subTotal = job.subtotal ? parseFloat(job.subtotal) : job.amount;

        // const days = await fetchSessionPaySlip(job.job_id, subTotal);;

        const days = await fetchSessionPaySlip(job.job_id, job.amount, job.hours, res.locals.user_id.id);

        // Calculate total subtotal from individual day subtotals
        const totalDaySubtotal = Object.values(days).reduce((sum, day) => {
          const value = parseFloat(day.subtotal ?? 0);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);

        // Use the day subtotal sum if it's not 0, else fallback to job.amount
        const subTotal = totalDaySubtotal > 0 ? totalDaySubtotal : (job.subtotal ? parseFloat(job.subtotal) : job.amount);

        const company_image = await fetchCompanyImage(job.company);
        const accepted_date = await fetchAcceptedDate(
          job.job_id,
          res.locals.user_id.id
        );

        return {
          job_title: job.job_title ?? "",
          job_location: job.location ?? "",
          job_image: company_image,
          date_accepted: accepted_date,
          date_completed: job.updated_at ?? "",
          job_hours: job.hours ? parseFloat(job.hours) : 0,
          job_amount: job.amount ? parseFloat(job.amount) : 0,
          days_on_duty: {
            days,
            total: {
              subtotal: subTotal,
              service_charge: serviceCharge(subTotal),
              grand_total: subTotal - serviceCharge(subTotal),
            },
          },
        };
      })
    );

    // Create a key based on the date range
    const rangeKey = `${start_date} - ${end_date}`;
    const responseData = {
      [ fetch_all ? "latest 10" : rangeKey]: jobs,
    };

    res.status(200).json(
      Response({
        success: true,
        message: `Fetched payslip for  ${ fetch_all ? "latest 10" : `${rangeKey}`}`,
        data: responseData,
      })
    );
  } catch (error) {
    logger("get-payslip").error("PaySlipByDateRange : ", `${error}`);
    res.status(422).json(
      Response({
        success: false,
        message: `System error - ${error}`,
      })
    );
  }
};

const getJobDays = async (req, res) => {
  try {
    const touch = await fetchJobDays(req, res);

    if (Object.keys(touch).length > 0) {
      res.status(201).json(
        Response({
          success: true,
          message: "Job Fetched",
          data: touch,
        })
      );
    } else {
      res.status(404).json(
        Response({
          success: false,
          message: "Job never applied",
          data: [],
        })
      );
    }
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);
    res.status(422).json(
      Response({
        success: false,
        message: `System error - ${error}`,
      })
    );
  }
};

module.exports = { fetchAll, fetch, apply, fetchApplyJob, payslip, getJobDays };
