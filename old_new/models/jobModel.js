const db = require("../db/connection_new.js");
const logger = require("../utils/logger.js");

const fetchAllJobs = async (req, res) => {
  try {
    // const sql = "SELECT id, company, position, salary, location, job_type, job_desc, job_requirement, created_at FROM posted_jobs";

    // const fetch = await db.query(sql,[]);

    // return fetch;

    const sql =
      "SELECT pj.id AS pj, company, job_title, price_per_hour, employment_type, time_of_posting_job, address, lng, lat, company_name, u.id, phone_number, profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4 FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id ORDER BY pj.id DESC";

    const fetch = await db.query(sql, []);

    const payload = fetch.map((job) => ({
      job_id: job.pj,
      job_title: job.job_title,
      price_per_hour: job.price_per_hour,
      employment_type: job.employment_type,
      time_of_posting_job: job.time_of_posting_job,
      location_company_details: {
        location_name: job.address,
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
    }));

    return payload;
  } catch (error) {
    logger("fetch_all_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchAJob = async (req, res) => {
  try {
    // const sql = "SELECT pj.id, company, position, salary, location, job_type, job_desc, job_requirement, created_at FROM posted_jobs WHERE id = ?";

    // const fetch = await db.query(sql,[req.body.id]);

    // return fetch;

    const sql =
      "SELECT pj.id AS pj, company, job_title, price_per_hour, employment_type, time_of_posting_job, address, lng, lat, company_name, u.id, phone_number, profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4 FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id WHERE pj.id = ? ORDER BY pj.id DESC";

    const fetch = await db.query(sql, [req.body.id]);

    const payload = fetch.map((job) => ({
      job_id: job.pj,
      job_title: job.job_title,
      price_per_hour: job.price_per_hour,
      employment_type: job.employment_type,
      time_of_posting_job: job.time_of_posting_job,
      location_company_details: {
        location_name: job.address,
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
    }));

    return payload;
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchForCompany = async (req, res) => {
  try {
    const sql =
      "SELECT pj.id AS pj, company, job_title, price_per_hour, employment_type, time_of_posting_job, address, lng, lat, company_name, u.id, phone_number, profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4 FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id WHERE pj.company = ? ORDER BY pj.id DESC";

    const fetch = await db.query(sql, [res.locals.user_id.id]);

    const payload = fetch.map((job) => ({
      job_id: job.pj,
      job_title: job.job_title,
      price_per_hour: job.price_per_hour,
      employment_type: job.employment_type,
      time_of_posting_job: job.time_of_posting_job,
      location_company_details: {
        location_name: job.address,
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
    }));

    return payload;
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchAJobForCompany = async (req, res) => {
  try {
    const sql =
      "SELECT pj.id AS pj, company, job_title, price_per_hour, employment_type, time_of_posting_job, address, lng, lat, company_name, u.id, phone_number, profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4 FROM posted_jobs AS pj LEFT JOIN users AS u ON pj.company = u.id WHERE pj.id = ? AND pj.company = ? ORDER BY pj.id DESC";

    const fetch = await db.query(sql, [req.body.id, res.locals.user_id.id]);

    const payload = fetch.map((job) => ({
      job_id: job.pj,
      job_title: job.job_title,
      price_per_hour: job.price_per_hour,
      employment_type: job.employment_type,
      time_of_posting_job: job.time_of_posting_job,
      location_company_details: {
        location_name: job.address,
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
    }));

    return payload;
  } catch (error) {
    logger("fetch_a_job").error("Job Fetch : ", `${error}`);

    return false;
  }
};

const fetchJobApplications = async (req, res) => {
  try {
    const sql = `
        SELECT ap.id AS ap, job_title, price_per_hour, employment_type, time_of_posting_job, up.address, up.lng, up.lat, up.company_name, up.id AS company, up.phone_number, up.profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4, u.pronouns, u.title, u.first_name, u.last_name, u.email, u.profile_picture AS candidate_photo, u.phone_number AS candidate_number, u.gender, ap.status
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

    const payload = fetch.map((job) => ({
      job_id: job.ap,
      job_title: job.job_title,
      price_per_hour: job.price_per_hour,
      employment_type: job.employment_type,
      time_of_posting_job: job.time_of_posting_job,
      location_company_details: {
        location_name: job.address,
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
      applied_candidate: {
        pronouns: job.pronouns,
        full_name: job.title + " " + job.first_name + " " + job.last_name,
        email: job.email,
        profile: job.candidate_photo,
        phone_number: job.candidate_number,
        gender: job.gender,
      },
      application_status: job.status,
    }));

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
          SELECT ap.id AS ap, job_title, price_per_hour, employment_type, time_of_posting_job, up.address, up.lng, up.lat, up.company_name, up.id AS company, up.phone_number, up.profile_picture, duty_1, duty_2, duty_3, duty_4, requirment_1, requirment_2, requirment_3, requirment_4, u.pronouns, u.title, u.first_name, u.last_name, u.email, u.profile_picture AS candidate_photo, u.phone_number AS candidate_number, u.gender, ap.status
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
  
      const payload = fetch.map((job) => ({
        job_id: job.ap,
        job_title: job.job_title,
        price_per_hour: job.price_per_hour,
        employment_type: job.employment_type,
        time_of_posting_job: job.time_of_posting_job,
        location_company_details: {
          location_name: job.address,
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
        applied_candidate: {
          pronouns: job.pronouns,
          full_name: job.title + " " + job.first_name + " " + job.last_name,
          email: job.email,
          profile: job.candidate_photo,
          phone_number: job.candidate_number,
          gender: job.gender,
        },
        application_status: job.status,
      }));
  
      return payload;
    } catch (error) {
      logger("fetch_job_applications").error(
        "Fetch job applications : ",
        `${error}`
      );
  
      return false;
    }
  };

module.exports = {
  fetchAllJobs,
  fetchAJob,
  fetchForCompany,
  fetchAJobForCompany,
  fetchJobApplications,
  fetchJobApplicationsStatus,
};
