const db = require("../db/connection_new.js");
const logger = require("../utils/logger.js");
const Response = require("../utils/standardResponse.js");

const fetch = async (req, res) => {
  try {
    //*****return all jobs added */
    // const fetch = await db.query(
    //   "SELECT  * FROM bookings_view WHERE candidate_id = ? AND book_status = ?",
    // [res.locals.user_id.id, req.body.status]
    // );

    const fetch = await db.query(
      `SELECT * FROM bookings_view 
         LEFT JOIN posted_jobs ON bookings_view.job_id = posted_jobs.id
         LEFT JOIN users ON posted_jobs.company = users.id
         WHERE bookings_view.candidate_id = ? 
         AND bookings_view.book_status = ?`,
      [res.locals.user_id.id, req.body.status]
    );

    const payload = await Promise.all(
      fetch.map(async (job) => {
        // **Fetch days session first
        const daysSession = await fetchOnlyJobSession(job.job_id);
         return query_result(job, daysSession);
      })
    );

    // const payload = fetch.map((job) => ({
    //   job_id: job.job_id,
    //   job_title: job.job_title,
    //   price_per_hour: job.price_per_hour,
    //   salary: job.salary,
    //   per_day: job.per_day,
    //   per_hour: job.per_hour,
    //   job_type: job.job_type,
    //   job_location: job.location,
    //   hours: job.hours,
    //   employment_type: job.employment_type,
    //   time_of_posting_job: job.time_of_posting_job,
    //   job_start_date: job.posted_start_date,
    //   position: job.position === null ? "" : job.position,
    //   roles: job.roles === null ? "" : job.roles,
    //   location_company_details: {
    //     location_name: job.address,
    //     postcode: job.postcode,
    //     longitude: job.lng,
    //     latitude: job.lat,
    //     company_name: job.company_name,
    //     company_id: job.company,
    //     company_number: job.phone_number,
    //     company_logo: job.profile_picture,
    //   },
    //   about_job: {
    //     main_duties: {
    //       duty_1: job.duty_1,
    //       duty_2: job.duty_2,
    //       duty_3: job.duty_3,
    //       duty_4: job.duty_4,
    //     },
    //     requirments: {
    //       requirment_1: job.requirment_1,
    //       requirment_2: job.requirment_2,
    //       requirment_3: job.requirment_3,
    //       requirment_4: job.requirment_4,
    //     },
    //   },
    //   book_status: job.book_status,
    // }));

    return payload;
  } catch (error) {
    logger("candidate_fetch_book").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

function query_result(job, day_Session) {
  return {
      job_id: job.job_id,
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
      book_status: job.book_status,
  };
}

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

module.exports = { fetch };
