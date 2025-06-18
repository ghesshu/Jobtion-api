const { access } = require("fs-extra");
const db = require("../db/connection_new.js");

const getAllPermanentJobs = async (req, res) => {
    try {
        const details = await db.query(
          `SELECT * FROM posted_jobs_view 
           WHERE job_type = ?
           ORDER BY id DESC`,
          ["Permanent"]
        );
    
        // res.json({ success: true, data: details });
    
        return details;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
};

const getAllTemporaryJobs = async (req, res) => {
    try {
        const details = await db.query(
          `SELECT * FROM posted_jobs_view 
           WHERE job_type = ?
           ORDER BY id DESC`,
          ["Temporary"]
        );
    
        // res.json({ success: true, data: details });
    
        return details;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
};

const fetchOnlyJobSession = async (job_id) => {
  const days = await db.query(
    `SELECT day, break, start_at, start_end FROM day_job WHERE job_id = ?`,
    [job_id]
  );

  const payload = {};

   days.forEach((job) => {
       payload[job.day] = {
           day: job.day,
           break_time:job.break,
           start_at: job.start_at,
           start_end: job.start_end,
           status: job.status,
           created_at: job.created_at,
       };
   });

  // console.log(days);

  return payload;
};

let mysql_job_interview_query = `SELECT ap.id AS app_id, ap.interview_date, ap.interview_time, ap.interview_invite_link, ap.interview_by, u.pronouns, u.title, u.first_name, u.last_name, u.email, u.profile_picture AS candidate_photo, u.phone_number AS candidate_number, u.gender, ap.status`;

const fetchJobApplications = async (job_id) => {
  try {
    const sql = `
        ${mysql_job_interview_query}
        FROM
            applications
            AS
            ap
            LEFT JOIN
            users AS u ON ap.candidate = u.id
            LEFT JOIN
            users AS up ON ap.company = up.id
        WHERE
            ap.job = ? AND ap.status = ?
        ORDER BY ap.job DESC`;

    const fetch = await db.query(sql, [job_id, 'accepted']);

    return fetch;
  } catch (error) {
    logger("fetch_job_applications").error(
      "Fetch job applications : ",
      `${error}`
    );

    return false;
  }
};

const getAllJobs = async (req, res) => {
  try {
      const data = await db.query(
        `SELECT * FROM posted_jobs 
         ORDER BY id DESC`,
        []
      );

      const payload = await Promise.all(
        data.map(async (job) => {
          // **Fetch days session first
          const daysSession = await fetchOnlyJobSession(job.id);
          const applications = await fetchJobApplications(job.id);
  
          return query_result(job, daysSession, applications);
        })
      );
  
      return payload;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
};

function query_result(job, day_session, applications) {
  return {
    "id": job.id,
    "job_title": job.job_title,
    "payment_type": job.payment_type,
    "amount": job.amount,
    "job_type": job.job_type,
    "employment_type": job.employment_type,
    "job_location": job.location,
    "hours": job.hours,
    "duty_1": job.duty_1,
    "duty_2": job.duty_2,
    "duty_3": job.duty_3,
    "duty_4": job.duty_4,
    "requirment_1": job.requirment_1,
    "requirment_2": job.requirment_2,
    "requirment_3": job.requirment_3,
    "requirment_4": job.requirment_4,
    "company_id": job.company,
    "posted_start_date": job.posted_start_date,
    "posted_roles": job.roles,
    "publish": job.status,
    "position": job.position,
    "job_desc": job.job_desc,
    "job_requirement": job.job_requirement,
    "time_of_posting_job": job.time_of_posting_job,
    day_session,
    applications,
    "created_at": job.created_at,
    "updated_at": job.updated_at,
  };
}

module.exports = { getAllPermanentJobs, getAllTemporaryJobs, getAllJobs };
