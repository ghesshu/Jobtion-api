// const db = require("../db/connection_new.js");

// const insert = async (res, req, availability) => {
//   const insertion = await db.query(
//     `INSERT INTO ${availability.day}(user_id,bs,m,a_s,a,e,o_n,ad,start_at,start_end) VALUES(?,?,?,?,?,?,?,?,?,?)`,
//     [
//       res.locals.user_id.id,
//       availability.bs,
//       availability.m,
//       availability.a_s,
//       availability.a,
//       availability.e,
//       availability.o_n,
//       availability.ad,
//       availability.start_at,
//       availability.start_end,
//     ]
//   );

//   return {
//     "DB Response : ": insertion,
//     "Availability Data : ": availability,
//     "User ID : ": res.locals.user_id.id,
//     "User Email : ": req.email,
//   };
// };

// const insertJobDays = async (res, data) => {
//   const insertion = await db.query(
//     `INSERT INTO ${data.day}(user_id, job_id,start_at,start_end) VALUES(?,?,?,?)`,
//     [data.user_id, data.job_id, data.start_at, data.end_at]
//   );

//   return { "DB Response : ": insertion, "Job Day Data : ": data };
// };

// const insertJobSession = async (res, req) => {
//   const insertion = await db.query(
//     `INSERT INTO ${req.body.day}(user_id,job_id,status,start_at,start_end) VALUES(?,?,?,?,?)`,
//     [
//       res.locals.user_id.id,
//       req.body.job_id,
//       1,
//       req.body.start_at,
//       req.body.start_end,
//     ]
//   );

//   return {
//     "DB Response : ": insertion,
//     "Availability Data : ": req.body,
//     "User ID : ": res.locals.user_id.id,
//     "User Email : ": req.email,
//   };
// };

// const updateJobSession = async (res, req) => {
//   const insertion = await db.query(
//     `UPDATE ${req.body.day} SET start_at = ?, start_end = ?, created_at = ? WHERE user_id = ? AND job_id = ?`,
//     [
//       req.body.start_at,
//       req.body.start_end,
//       new Date(),
//       res.locals.user_id.id,
//       req.body.job_id,
//     ]
//   );

//   return {
//     "DB Response : ": insertion,
//     "Availability Data : ": req.body,
//     "User ID : ": res.locals.user_id.id,
//     "User Email : ": req.email,
//   };
// };

// const insertIniJobSession = async (res, data) => {
//   const insertion = await db.query(
//     `INSERT INTO ${data.day}(user_id,job_id,status,start_at,start_end) VALUES(?,?,?,?,?)`,
//     [res.locals.user_id.id, data.job_id, 0, data.start_at, data.start_end]
//   );

//   return {
//     "DB Response : ": insertion,
//     "Availability Data : ": data,
//     "User ID : ": res.locals.user_id.id,
//   };
// };

// const updateIniJobSession = async (res, data) => {
//   const insertion = await db.query(
//     `UPDATE ${data.day} SET start_at = ?, start_end = ?, created_at = ? WHERE user_id = ? AND job_id = ?`,
//     [
//       data.start_at,
//       data.start_end,
//       new Date(),
//       res.locals.user_id.id,
//       data.job_id,
//     ]
//   );

//   return {
//     "DB Response : ": insertion,
//     "Availability Data : ": data,
//     "User ID : ": res.locals.user_id.id,
//   };
// };

// const update = async (res, req, availability) => {
//   const updating = await db.query(
//     `UPDATE ${availability.day} SET bs = ?, m=?, a_s = ?, a = ?, e = ?, o_n = ?, ad = ?, start_at = ?, start_end = ? WHERE user_id = ?`,
//     [
//       availability.bs,
//       availability.m,
//       availability.a_s,
//       availability.a,
//       availability.e,
//       availability.o_n,
//       availability.ad,
//       availability.start_at,
//       availability.start_end,
//       res.locals.user_id.id,
//     ]
//   );

//   return {
//     "DB Response : ": updating,
//     "Availability Data : ": availability,
//     "User ID : ": res.locals.user_id.id,
//     "User Email : ": req.email,
//   };
// };

// //*******updating into the job completed table */
// const updateJobCompleted = async (res, req) => {
//   await db.query(
//     `UPDATE completed_job SET status = ?, updated_at = ? WHERE user_id = ? AND job_id = ? AND day = ?`,
//     [1, new Date(), res.locals.user_id.id, req.body.job_id, req.body.day]
//   );

//   return true;
// };

// const insertJobCompleted = async (res, req) => {
//   const insertion = await db.query(
//     `INSERT INTO completed_job(job_id,user_id,day,number_of_hours,subtotal,status,start,end) VALUES(?,?,?,?,?,?,?,?)`,
//     [
//       req.job_id,
//       res.locals.user_id.id,
//       req.day,
//       req.number_of_hours,
//       req.subtotal,
//       0,
//       req.start_at,
//       req.start_end,
//     ]
//   );

//   return {
//     "DB Response : ": insertion,
//     "Availability Data : ": req.body,
//     "User ID : ": res.locals.user_id.id,
//     "User Email : ": req.email,
//   };
// };

// //******fetch all days */
// const fetch = async (res) => {
//   const monday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM monday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const tuesday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM tuesday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const wednesday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM wednesday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const thursday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM thursday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const friday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM friday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const saturday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM saturday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const sunday = await db.query(
//     `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM sunday_view WHERE user_id = ?`,
//     [res.locals.user_id.id]
//   );

//   const payload = {
//     Monday: monday,
//     Tuesday: tuesday,
//     Wednesday: wednesday,
//     Thursday: thursday,
//     Friday: friday,
//     Saturday: saturday,
//     Sunday: sunday,
//   };

//   return payload;
// };

// const fetchJobSession = async (user_id) => {
//   const monday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM monday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const tuesday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM tuesday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const wednesday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM wednesday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const thursday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM thursday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const friday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM friday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const saturday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM saturday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const sunday = await db.query(
//     `SELECT job_id, status,start,end,created_at FROM sunday_view WHERE user_id = ?`,
//     [user_id]
//   );

//   const payload = {
//     monday: monday,
//     tuesday: tuesday,
//     wednesday: wednesday,
//     thursday: thursday,
//     friday: friday,
//     saturday: saturday,
//     sunday: sunday,
//   };

//   // return payload;
//   //     const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

//   // const payload = {};

//   // for (const day of days) {
//   //     const result = await db.query(`SELECT job_id, status, start, end, created_at FROM ${day}_view WHERE user_id = ?`, [user_id]);

//   //     payload[day] = {};
//   //     for (const row of result) {
//   //         const { job_id, status, start, end, created_at } = row;
//   //         payload[day][job_id] = { status, start, end, created_at };
//   //     }
//   // }

//   return payload;
// };

// const fetchAllJobSession = async (job_id) => {
//   console.log("Job ID : ", job_id);

//   const monday = await db.query(
//     `SELECT start_at, start_end,created_at FROM monday_job WHERE job_id = ?`,
//     [job_id]
//   );

//   // const tuesday = await db.query(`SELECT status,start,end,created_at FROM tuesday_view WHERE user_id = ?`,[user_id])

//   // const wednesday = await db.query(`SELECT status,start,end,created_at FROM wednesday_view WHERE user_id = ?`,[user_id])

//   // const thursday = await db.query(`SELECT status,start,end,created_at FROM thursday_view WHERE user_id = ?`,[user_id])

//   // const friday = await db.query(`SELECT status,start,end,created_at FROM friday_view WHERE user_id = ?`,[user_id])

//   // const saturday = await db.query(`SELECT status,start,end,created_at FROM saturday_view WHERE user_id = ?`,[user_id])

//   // const sunday = await db.query(`SELECT status,start,end,created_at FROM sunday_view WHERE user_id = ?`,[user_id])

//   const payload = {
//     monday: monday,
//     // "tuesday": tuesday,
//     // "wednesday": wednesday,
//     // "thursday": thursday,
//     // "friday" : friday,
//     // "saturday" : saturday,
//     // "sunday" : sunday
//   };

//   return payload;
// };

// const fetchSession = async (job_id) => {
//   const days = await db.query(
//     `SELECT day, start_at, start_end, created_at FROM day_job WHERE job_id = ?`,
//     [job_id]
//   );

//   const payload = {};

//   days.forEach((job) => {
//     payload[job.day] = {
//       start_at: job.start_at,
//       start_end: job.start_end,
//       created_at: job.created_at,
//     };
//   });

//   return payload;
// };

// const fetchCandidateJobSession = async (res, job_id) => {
//   const days = await db.query(
//     `SELECT day, start, end, status, created_at FROM completed_job WHERE job_id = ? AND user_id = ?`,
//     [job_id, res.locals.user_id.id]
//   );

//   const payload = {};

//   // days.forEach((job) => {
//   //   payload[job.day] = {
//   //     start_at: job.start,
//   //     start_end: job.end,
//   //     status: job.status,
//   //     created_at: job.created_at,
//   //   };
//   // });

//   return days;
// };

// const fetchASession = async (job_id) => {
//   const days = await db.query(
//     `SELECT day, job_id, number_of_hours, subtotal, start_at, start_end, created_at FROM day_job WHERE job_id = ?`,
//     [job_id]
//   );

//   const payload = {
//     days,
//   };

//   // days.forEach((job) => {
//   //     payload[job.day] = {
//   //         day: job.day,
//   //         start_at: job.start_at,
//   //         start_end: job.start_end,
//   //         created_at: job.created_at
//   //     };
//   // });

//   return payload;
// };

// const fetchSessionPaySlip = async (job_id) => {
//   const days = await db.query(
//     `SELECT day, number_of_hours, subtotal FROM completed_job WHERE job_id = ? AND status = ?`,
//     [job_id,1]
//   );

//   const payload = {};

//   days.forEach((job) => {

//     console.log("Job : ",job);
//     payload[job.day] = {
//       number_of_hours: job.number_of_hours,
//       subtotal: job.subtotal,
//     };
//   });

//   return payload;
// };

// module.exports = {
//   insert,
//   update,
//   fetch,
//   insertJobSession,
//   updateJobSession,
//   insertIniJobSession,
//   updateIniJobSession,
//   fetchCandidateJobSession,
//   fetchJobSession,
//   fetchAllJobSession,
//   insertJobDays,
//   fetchSession,
//   fetchASession,
//   updateJobCompleted,
//   insertJobCompleted,
//   fetchSessionPaySlip,
// };


const db = require("../db/connection_new.js");
const { serviceCharge } = require("../utils/custom_function.js");

const insert = async (res, req, availability) => {
  const insertion = await db.query(
    `INSERT INTO ${availability.day}(user_id,bs,m,a_s,a,e,o_n,ad,start_at,start_end) VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [
      res.locals.user_id.id,
      availability.bs,
      availability.m,
      availability.a_s,
      availability.a,
      availability.e,
      availability.o_n,
      availability.ad,
      availability.start_at,
      availability.start_end,
    ]
  );

  return {
    "DB Response : ": insertion,
    "Availability Data : ": availability,
    "User ID : ": res.locals.user_id.id,
    "User Email : ": req.email,
  };
};

const insertJobDays = async (res, data) => {
  const insertion = await db.query(
    `INSERT INTO ${data.day}(user_id, job_id,start_at,start_end) VALUES(?,?,?,?)`,
    [data.user_id, data.job_id, data.start_at, data.end_at]
  );

  return { "DB Response : ": insertion, "Job Day Data : ": data };
};

const insertJobSession = async (res, req) => {
  const insertion = await db.query(
    `INSERT INTO ${req.body.day}(user_id,job_id,status,start_at,start_end) VALUES(?,?,?,?,?)`,
    [
      res.locals.user_id.id,
      req.body.job_id,
      1,
      req.body.start_at,
      req.body.start_end,
    ]
  );

  return {
    "DB Response : ": insertion,
    "Availability Data : ": req.body,
    "User ID : ": res.locals.user_id.id,
    "User Email : ": req.email,
  };
};

const updateJobSession = async (res, req) => {
  const insertion = await db.query(
    `UPDATE ${req.body.day} SET start_at = ?, start_end = ?, created_at = ? WHERE user_id = ? AND job_id = ?`,
    [
      req.body.start_at,
      req.body.start_end,
      new Date(),
      res.locals.user_id.id,
      req.body.job_id,
    ]
  );

  return {
    "DB Response : ": insertion,
    "Availability Data : ": req.body,
    "User ID : ": res.locals.user_id.id,
    "User Email : ": req.email,
  };
};

const insertIniJobSession = async (res, data) => {
  const insertion = await db.query(
    `INSERT INTO ${data.day}(user_id,job_id,status,start_at,start_end) VALUES(?,?,?,?,?)`,
    [res.locals.user_id.id, data.job_id, 0, data.start_at, data.start_end]
  );

  return {
    "DB Response : ": insertion,
    "Availability Data : ": data,
    "User ID : ": res.locals.user_id.id,
  };
};

const updateIniJobSession = async (res, data) => {
  const insertion = await db.query(
    `UPDATE ${data.day} SET start_at = ?, start_end = ?, created_at = ? WHERE user_id = ? AND job_id = ?`,
    [
      data.start_at,
      data.start_end,
      new Date(),
      res.locals.user_id.id,
      data.job_id,
    ]
  );

  return {
    "DB Response : ": insertion,
    "Availability Data : ": data,
    "User ID : ": res.locals.user_id.id,
  };
};

const update = async (res, req, availability) => {
  const updating = await db.query(
    `UPDATE ${availability.day} SET bs = ?, m=?, a_s = ?, a = ?, e = ?, o_n = ?, ad = ?, start_at = ?, start_end = ? WHERE user_id = ?`,
    [
      availability.bs,
      availability.m,
      availability.a_s,
      availability.a,
      availability.e,
      availability.o_n,
      availability.ad,
      availability.start_at,
      availability.start_end,
      res.locals.user_id.id,
    ]
  );

  return {
    "DB Response : ": updating,
    "Availability Data : ": availability,
    "User ID : ": res.locals.user_id.id,
    "User Email : ": req.email,
  };
};

//*******updating into the job completed table */
const updateJobCompleted = async (res, req) => {
  await db.query(
    `UPDATE completed_job SET break_time_updated = ?, updated_at = ?, start = ?, end = ?, break_time = ? WHERE user_id = ? AND job_id = ? AND day = ?`,
    [req.body.status, new Date(), req.body.start_at, req.body.start_end, req.body.break_time, res.locals.user_id.id, req.body.job_id, req.body.day]
  );

  return true;
};

const insertJobCompleted = async (res, req) => {
  const insertion = await db.query(
    `INSERT INTO completed_job(job_id,user_id,day,number_of_hours,subtotal,status,start,end) VALUES(?,?,?,?,?,?,?,?)`,
    [
      req.job_id,
      res.locals.user_id.id,
      req.day,
      req.number_of_hours,
      req.subtotal,
      0,
      req.start_at,
      req.start_end,
    ]
  );

  return {
    "DB Response : ": insertion,
    "Availability Data : ": req.body,
    "User ID : ": res.locals.user_id.id,
    "User Email : ": req.email,
  };
};

//******fetch all days */
const fetch = async (res) => {
  const monday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM monday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const tuesday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM tuesday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const wednesday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM wednesday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const thursday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM thursday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const friday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM friday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const saturday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM saturday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const sunday = await db.query(
    `SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner as All_Day, start, end FROM sunday_view WHERE user_id = ?`,
    [res.locals.user_id.id]
  );

  const payload = {
    Monday: monday,
    Tuesday: tuesday,
    Wednesday: wednesday,
    Thursday: thursday,
    Friday: friday,
    Saturday: saturday,
    Sunday: sunday,
  };

  return payload;
};

const fetchJobSession = async (user_id) => {
  const monday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM monday_view WHERE user_id = ?`,
    [user_id]
  );

  const tuesday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM tuesday_view WHERE user_id = ?`,
    [user_id]
  );

  const wednesday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM wednesday_view WHERE user_id = ?`,
    [user_id]
  );

  const thursday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM thursday_view WHERE user_id = ?`,
    [user_id]
  );

  const friday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM friday_view WHERE user_id = ?`,
    [user_id]
  );

  const saturday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM saturday_view WHERE user_id = ?`,
    [user_id]
  );

  const sunday = await db.query(
    `SELECT job_id, status,start,end,created_at FROM sunday_view WHERE user_id = ?`,
    [user_id]
  );

  const payload = {
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };

  // return payload;
  //     const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  // const payload = {};

  // for (const day of days) {
  //     const result = await db.query(`SELECT job_id, status, start, end, created_at FROM ${day}_view WHERE user_id = ?`, [user_id]);

  //     payload[day] = {};
  //     for (const row of result) {
  //         const { job_id, status, start, end, created_at } = row;
  //         payload[day][job_id] = { status, start, end, created_at };
  //     }
  // }

  return payload;
};

const fetchAllJobSession = async (job_id) => {
  console.log("Job ID : ", job_id);

  const monday = await db.query(
    `SELECT start_at, start_end,created_at FROM monday_job WHERE job_id = ?`,
    [job_id]
  );

  // const tuesday = await db.query(`SELECT status,start,end,created_at FROM tuesday_view WHERE user_id = ?`,[user_id])

  // const wednesday = await db.query(`SELECT status,start,end,created_at FROM wednesday_view WHERE user_id = ?`,[user_id])

  // const thursday = await db.query(`SELECT status,start,end,created_at FROM thursday_view WHERE user_id = ?`,[user_id])

  // const friday = await db.query(`SELECT status,start,end,created_at FROM friday_view WHERE user_id = ?`,[user_id])

  // const saturday = await db.query(`SELECT status,start,end,created_at FROM saturday_view WHERE user_id = ?`,[user_id])

  // const sunday = await db.query(`SELECT status,start,end,created_at FROM sunday_view WHERE user_id = ?`,[user_id])

  const payload = {
    monday: monday,
    // "tuesday": tuesday,
    // "wednesday": wednesday,
    // "thursday": thursday,
    // "friday" : friday,
    // "saturday" : saturday,
    // "sunday" : sunday
  };

  return payload;
};

const fetchSession = async (job_id) => {
  const days = await db.query(
    `SELECT day, start_at, start_end, created_at FROM day_job WHERE job_id = ?`,
    [job_id]
  );

  const payload = {};

  days.forEach((job) => {
    payload[job.day] = {
      start_at: job.start_at,
      start_end: job.start_end,
      created_at: job.created_at,
    };
  });

  return payload;
};

const fetchCandidateJobSession = async (res, job_id) => {
  const days = await db.query(
    `SELECT day, start, end, break_time_updated as status, break_time, created_at FROM completed_job WHERE job_id = ? AND user_id = ?`,
    [job_id, res.locals.user_id.id]
  );

  const payload = {};

   days.forEach((job) => {
     payload[job.day] = {
       day: job.day,
       break_time: job.break_time,
       start_at: job.start,
       start_end: job.end,
       status: job.status,
       created_at: job.created_at,
     };
   });

  return payload;
};

const fetchASession = async (job_id) => {
  const days = await db.query(
    `SELECT day, job_id, number_of_hours, subtotal, start_at, start_end, created_at FROM day_job WHERE job_id = ?`,
    [job_id]
  );

  const payload = {
    days,
  };

  // days.forEach((job) => {
  //     payload[job.day] = {
  //         day: job.day,
  //         start_at: job.start_at,
  //         start_end: job.start_end,
  //         created_at: job.created_at
  //     };
  // });

  return payload;
};

// const fetchSessionPaySlip = async (job_id, amount, hours) => {
//   const days = await db.query(
//     `SELECT day, number_of_hours, subtotal FROM completed_job WHERE job_id = ? AND status = ?`,
//     [job_id, 1]
//   );

//   const payload = {};

//   days.forEach((job) => {
//     payload[job.day] = {
//       number_of_hours: hours,
//       amount: amount,
//     };
//   });

//   return payload;
// };

const fetchSessionPaySlip = async (job_id, amount, hours, id) => {
  const days = await db.query(
    `SELECT day, number_of_hours, subtotal FROM completed_job WHERE job_id = ? AND status = ? AND user_id = ?`,
    [job_id, 1, id]
  );

  const payload = {};

  days.forEach((job) => {
    console.log("job.subtotal : ", amount);
    const cj_amount = job.subtotal === 0 ? amount : job.subtotal
    const subtotal = cj_amount * hours;
    payload[job.day] = {
      number_of_hours: hours,
      amount: cj_amount,
      subtotal: subtotal,
    };
  });

  return payload;
};

module.exports = {
  insert,
  update,
  fetch,
  insertJobSession,
  updateJobSession,
  insertIniJobSession,
  updateIniJobSession,
  fetchCandidateJobSession,
  fetchJobSession,
  fetchAllJobSession,
  insertJobDays,
  fetchSession,
  fetchASession,
  updateJobCompleted,
  insertJobCompleted,
  fetchSessionPaySlip,
};

