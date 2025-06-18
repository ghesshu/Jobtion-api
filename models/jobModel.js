const db = require("../db/connection_new.js");
const {
  fetchJobSession,
  fetchAllJobSession,
  fetchSession,
  fetchCandidateJobSession,
} = require("../middlewares/availabilityMiddleware.js");
const logger = require("../utils/logger.js");

let mysql_job_query = `SELECT pj.id AS pj, company, job_title, amount, payment_type, position, job_type, pj.location, hours, employment_type, time_of_posting_job, roles, address, postcode, lng, lat, company_name, u.id, phone_number, profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4, pj.posted_start_date`;
function query_result(job, day_Session) {
  return {
    job_id: job.pj,
    job_title: job.job_title,
    amount: job.amount === null ? 0 : job.amount,
    payment_type: job.payment_type === null ? "" : job.payment_type,
    job_type: job.job_type,
    job_location: job.location,
    hours: job.hours,
    employment_type: job.employment_type,
    time_of_posting_job: job.time_of_posting_job,
    job_start_date: job.posted_start_date,
    position: job.position === null ? "" : job.position,
    roles: job.roles === null ? "" : job.roles,
    location_company_details: {
      location_name: job.address,
      postcode: job.postcode,
      longitude: job.lng,
      latitude: job.lat,
      company_name: job.company_name,
      company_id: job.company,
      company_number: job.phone_number,
      company_logo: job.profile_picture,
    },
    about_job: {
      main_duties: {
        duty_1: job.duty_1,
        duty_2: job.duty_2,
        duty_3: job.duty_3,
        duty_4: job.duty_4,
      },
      requirments: {
        requirment_1: job.requirment_1,
        requirment_2: job.requirment_2,
        requirment_3: job.requirment_3,
        requirment_4: job.requirment_4,
      },
    },
    day_Session,
  };
}

let mysql_job_interview_query = `SELECT ap.id AS ap, ap.job, ap.interview_date, ap.interview_time, ap.interview_invite_link, ap.interview_by, job_title, amount, payment_type, position, job_type, pj.location, hours, employment_type, time_of_posting_job, roles, up.address, up.postcode, up.lng, up.lat, up.company_name, up.id AS company, up.phone_number, up.profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4, u.pronouns, u.title, u.first_name, u.last_name, u.email, u.profile_picture AS candidate_photo, u.phone_number AS candidate_number, u.gender, ap.status`;

function query_interview_result(job,day_Session) {
  return {
    job_id: job.job,
    job_title: job.job_title,
    amount: job.amount === null ? 0 : job.amount,
    payment_type: job.payment_type === null ? 0 : job.payment_type,
    job_type: job.job_type,
    job_location: job.location,
    hours: job.hours,
    employment_type: job.employment_type,
    time_of_posting_job: job.time_of_posting_job,
    position: job.position,
    roles: job.roles,
    location_company_details: {
      location_name: job.address,
      postcode: job.postcode,
      longitude: job.lng,
      latitude: job.lat,
      company_name: job.company_name,
      company_id: job.company,
      company_number: job.phone_number,
      company_logo: job.profile_picture,
    },
    about_job: {
      main_duties: {
        duty_1: job.duty_1,
        duty_2: job.duty_2,
        duty_3: job.duty_3,
        duty_4: job.duty_4,
      },
      requirments: {
        requirment_1: job.requirment_1,
        requirment_2: job.requirment_2,
        requirment_3: job.requirment_3,
        requirment_4: job.requirment_4,
      },
    },
    day_Session,
    applied_candidate: {
      pronouns: job.pronouns,
      full_name: job.title + " " + job.first_name + " " + job.last_name,
      email: job.email,
      profile: job.candidate_photo,
      phone_number: job.candidate_number,
      gender: job.gender,
    },
    interview_details: {
      interview_date: job.interview_date === null ? "" : job.interview_date,
      interview_time: job.interview_time === null ? "" : job.interview_time,
      interview_invite_link:
        job.interview_invite_link === null ? "" : job.interview_invite_link,
      interview_by: job.interview_by === null ? "" : job.interview_by,
    },
    application_status: job.status,
  };
}

const fetchAllJobs = async (req, res) => {
  try {
    // const sql = ` ${mysql_job_query} FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id  WHERE pj.status = 0 ORDER BY pj.id DESC`;
    const sql = ` ${mysql_job_query} FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id`;
    const fetch = await db.query(sql, []);

    const payload = await Promise.all(
      fetch.map(async (job) => {
        // **Fetch days session first
        const daysSession = await fetchOnlyJobSession(job.pj);

        return query_result(job, daysSession);
      })
    );

    return payload;
  } catch (error) {
    logger("fetch_all_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchAJob = async (req, res) => {
  try {
    const sql = `${mysql_job_query} FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id WHERE pj.id = ? AND pj.status = 0 ORDER BY pj.id DESC`;

    const fetch = await db.query(sql, [req.body.id]);

    //*****fetching the Job Session days */
    const days = await fetchSession(req.body.id);

    const payload = await Promise.all(
      fetch.map(async (job) => {
        // **Fetch days session first
        const daysSession = await fetchOnlyJobSession(job.pj);

        return query_result(job, daysSession);
      })
    );

    return payload;
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

//****fetching all jobs for a company*/
const fetchForCompany = async (req, res) => {
  try {
    const sql = `${mysql_job_query} FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id WHERE pj.company = ? AND pj.status = 0 ORDER BY pj.id DESC`;

    const fetch = await db.query(sql, [res.locals.user_id.id]);

    const payload = await Promise.all(
      fetch.map(async (job) => {
        // **Fetch days session first
        const daysSession = await fetchOnlyJobSession(job.pj);

        return query_result(job, daysSession);
      })
    );

    return payload;
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchAJobForCompany = async (req, res) => {
  try {
    const sql = `${mysql_job_query} FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id WHERE pj.id = ? AND pj.company = ? AND pj.status = 0 ORDER BY pj.id DESC`;

    const fetch = await db.query(sql, [req.body.id, res.locals.user_id.id]);

    const payload = await Promise.all(
      fetch.map(async (job) => {
        // **Fetch days session first
        const daysSession = await fetchOnlyJobSession(job.pj);

        return query_result(job, daysSession);
      })
    );

    return payload;
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchJobApplications = async (req, res) => {
  try {
    const sql = `
        ${mysql_job_interview_query}
        FROM
            applications
            AS
            ap
            LEFT JOIN
            posted_jobs AS pj ON ap.job = pj.id
            LEFT JOIN
            users AS u ON ap.candidate = u.id
            LEFT JOIN
            users AS up ON ap.company = up.id
        WHERE
            ap.candidate = ?
        ORDER BY ap.id DESC`;

    const fetch = await db.query(sql, [res.locals.user_id.id]);

    const payload = fetch.map((job) => query_interview_result(job));

    return payload;
  } catch (error) {
    logger("fetch_job_applications").error(
      "Fetch job applications : ",
      `${error}`
    );

    return false;
  }
};

const fetchJobApplicationsStatus = async (req, res) => {
  try {
    const sql = `
          ${mysql_job_interview_query}
          FROM
              applications
              AS
              ap
              LEFT JOIN
              posted_jobs AS pj ON ap.job = pj.id
              LEFT JOIN
              users AS u ON ap.candidate = u.id
              LEFT JOIN
              users AS up ON ap.company = up.id
          WHERE
              ap.candidate = ? AND ap.status = ?
          ORDER BY ap.id DESC`;

    const fetch = await db.query(sql, [res.locals.user_id.id, req.body.status]);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const jobs = await Promise.all(
      fetch.map(async (job) => {
        // Fetch days session first
        const daysSession = await fetchCandidateJobSession(res, job.job);
        const payload = {};

        // const jobObject = 
        return query_interview_result(job, daysSession);

        // daysSession.forEach((job) => {
        //   payload[job.day] = {
        //     start_at: job.start,
        //     start_end: job.end,
        //     break_time: job.break_time,
        //     status: job.status,
        //     created_at: job.created_at,
        //   };
        // });

        // return { jobObject};
      })
    );

    //   const payload = {};

    // for (const job of jobs) {
    //     const { job_id, days_session } = job;

    //     payload[job_id] = {};

    //     for (const day in days_session) {
    //         if (days_session[day].length > 0) {
    //             payload[job_id][day] = days_session[day];
    //         }
    //     }
    // }

    // return {"job_details" : payload, "days_session" : days};
    return jobs;
  } catch (error) {
    logger("fetch_job_applications").error(
      "Fetch job applications : ",
      `${error}`
    );

    return false;
  }
};

const fetchJobDays = async (req, res) => {
  try {
    const sql = ` SELECT day, start, end, break_time, status, created_at FROM completed_job WHERE user_id = ? AND job_id = ?`;

    const fetch = await db.query(sql, [res.locals.user_id.id, req.body.job_id]);

    const payload = {};

    fetch.forEach((job) => {
      payload[job.day] = {
        start_at: job.start,
        start_end: job.end,
        break_time: job.break_time,
        status: job.status,
        created_at: job.created_at,
      };
    });

    return payload;
  } catch (error) {
    logger("fetch_job_applications").error(
      "Fetch job applications : ",
      `${error}`
    );

    console.log("error : ", error);

    return false;
  }
};

const fetchCompanyImage = async (company) => {
  try {
    const sql = `SELECT profile_picture FROM users WHERE id = ?`;

    const fetch = await db.query(sql, [company]);

    return fetch[0].profile_picture;
  } catch (error) {
    logger("fetch_job_image").error("Fetch job image : ", `${error}`);

    return false;
  }
};

const fetchAcceptedDate = async (job_id, user_id) => {
  try {
    const sql = `SELECT created_at FROM applications WHERE candidate = ? AND job = ?`;

    const fetch = await db.query(sql, [user_id, job_id]);

    return fetch[0].created_at;
  } catch (error) {
    logger("fetch_job_image").error("Fetch job image : ", `${error}`);

    return false;
  }
};

const fetchOnlyJobSession = async (job_id) => {
  const days = await db.query(
    `SELECT day, break, start_at, start_end, status, created_at FROM day_job WHERE job_id = ?`,
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
// const fetchJobLiked = async (req, res) => {};

module.exports = {
  fetchAllJobs,
  fetchAJob,
  fetchForCompany,
  fetchAJobForCompany,
  fetchJobApplications,
  fetchJobApplicationsStatus,
  fetchJobDays,
  fetchCompanyImage,
  fetchAcceptedDate,
};


