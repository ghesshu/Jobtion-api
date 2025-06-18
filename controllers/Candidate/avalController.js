const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {
  insert,
  update,
  fetch,
  insertJobSession,
  insertIniJobSession,
  updateIniJobSession,
  updateJobSession,
  insertJobDays,
  updateJobCompleted,
  insertJobCompleted,
  fetchCandidateJobSession,
} = require("../../middlewares/availabilityMiddleware.js");

const add = async (req, res) => {
  try {
    let counter = req.body.time_manager.length;

    //*******get all selected preference */
    // const selectedPreference = req.body.preference[0];

    // await db.query(
    //   `UPDATE preferences SET full_time = ? , part_time = ?, term_time = ?, after = ?  WHERE user_id = ?`,
    //   [
    //     selectedPreference.full_time,
    //     selectedPreference.part_time,
    //     selectedPreference.term_time,
    //     selectedPreference.after,
    //     res.locals.user_id.id,
    //   ]
    // );

    req.body.time_manager.forEach(async (manage) => {
      //*******Check first if the user already exists */
      const checkBooked = await db.query(
        `SELECT user_id FROM ${manage.day} WHERE user_id = ?`,
        [res.locals.user_id.id]
      );

      if (checkBooked.length > 0) {
        const updateAvail = await update(res, req, manage);
        logger("user_availability_update").info("Update : ", updateAvail);
      } else {
        const insertAvail = await insert(res, req, manage);
        logger("user_availability_insert").info("Update : ", insertAvail);
      }

      counter--;

      if (counter === 0) {
        res.status(201).json(
          Response({
            success: true,
            message: "Done",
          })
        );
        return "All Done";
      }
    });
  } catch (error) {
    // console.log(error)
    logger("user_availability").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const fetching = async (req, res) => {
  try {
    const fetchP = await fetch(res, req);

    res.status(201).json(
      Response({
        success: true,
        message: "Availability Fetched",
        data: fetchP,
      })
    );
  } catch (error) {
    // console.log(error)
    logger("user_avail").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: `System Error : ${error}`,
      })
    );
  }
};

const addJobDaySession = async (req, res) => {
  try {
    //*******Check first if the user already exists */
    const checkSession = await db.query(
      `SELECT user_id FROM ${req.body.day} WHERE user_id = ? AND job_id = ?`,
      [res.locals.user_id.id, req.body.job_id]
    );

    if (checkSession.length > 0) {
      const updateDaySession = await updateJobSession(res, req);
      logger("user_day_session_update").info("Update : ", updateDaySession);
      res.status(201).json(
        Response({
          success: true,
          message: "Session Updated",
          data: [],
        })
      );
    } else {
      // const insertDaySession = await insertJobSession(res, req);
      res.status(404).json(
        Response({
          success: false,
          message: "No Job Found",
          data: [],
        })
      );
      // logger("user_day_session_insert").info("Insert : ", insertDaySession);
    }

  } catch (error) {
    // console.log(error)
    logger("user_job_session").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

//*******adding into the table days */
const addInitialJobDaySession = async (data, res) => {
  try {
    data.days.forEach(async (manage) => {
      //*******Check first if the user already exists */
      const checkBooked = await db.query(
        `SELECT user_id FROM ${manage.day} WHERE user_id = ? AND job_id = ?`,
        [res.locals.user_id.id, manage.job_id]
      );

      console.log("checkBooked : ", checkBooked);

      if (checkBooked.length > 0) {
        const updateDaySession = await updateIniJobSession(res, manage);
        // logger("user_day_session_update").info("Update : ", updateDaySession);
      } else {
        const insertDaySession = await insertIniJobSession(res, manage);
        // logger("user_day_session_insert").info("Insert : ", insertDaySession);
      }
    });

    return true;
  } catch (error) {
    // console.log(error)
    logger("user_job_session").error("System Error : ", error);
    return false;
  }
};

//****inserting into the job completed table */
const addJobCompleted = async (req, res) => {
  try {
    console.log("completed jobs : ",req);
    req.days.forEach(async (manage) => {
      //*******Check first if the user already exists */
      const checkBooked = await db.query(
        `SELECT user_id FROM completed_job WHERE user_id = ? AND job_id = ? AND day = ?`,
        [res.locals.user_id.id, manage.job_id, manage.day]
      );


      if (checkBooked.length > 0) {
        //*****delete the job from completed jobs */
        const checkBooked = await db.query(
          `DELETE FROM completed_job WHERE user_id = ? AND job_id = ?`,
          [res.locals.user_id.id, manage.job_id]
        );

        if (checkBooked.affectedRows > 0) {
          //***reinsert the job in completed jobs */
        const insertDaySession = await insertJobCompleted(res, manage);
        console.log("Re-inserted DaySession : ", insertDaySession);
        }
        else{
          res.status(417).json(
            Response({
              success: false,
              message: "Sorry we are having technical issues, please try again later",
              data: [],
            })
          );
        }

        
        // const updateDaySession = await updateJobCompleted(res, manage);
        // console.log("updateDaySession : ", updateDaySession);
      } else {
        const insertDaySession = await insertJobCompleted(res, manage);
        console.log("insertDaySession : ", insertDaySession);
      }
    });
    
  } catch (error) {
    // console.log(error)
    logger("user_job_session").error("System Error : ", error);
    return false;
  }
};

const JobDaySession = async (req, res) => {
  try {
    //*******Check first if the user is accepted for the job */
    const check = await db.query(
      `SELECT status FROM applications WHERE candidate = ? AND job = ?`,
      [res.locals.user_id.id, req.body.job_id]
    );

    // console.log("check : ",check)

    if(check.length > 0 && check[0].status === 'accepted'){
      const checkSession = await db.query(
        `SELECT user_id, break_time_updated FROM completed_job WHERE user_id = ? AND job_id = ? AND day = ?`,
        [res.locals.user_id.id, req.body.job_id, req.body.day]
      );
  
      if (checkSession.length > 0) {
        // console.log(checkSession[0])
        if (checkSession[0].break_time_updated > 0) {
          res.status(422).json(
            Response({
              success: false,
              message: "Sorry you can only update your break time once !!",
              data: [],
            })
          );
        }
        else{
          const done = await updateJobCompleted(res, req);
        
        res.status(201).json(
          Response({
            success: true,
            message: "Session Updated",
            data: [],
          })
        );
        }
        
      } else {
        res.status(404).json(
          Response({
            success: false,
            message: "No Job Found...",
            data: [],
          })
        );
      }
    }
    else{
      res.status(401).json(
        Response({
          success: false,
          message: check.length > 0 ? "You have not been accepted for this job" : "No Job Found ",  
          data: [],
        })
      );
    }

  } catch (error) {
    // console.log(error)
    logger("user_job_session").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const FetchDaySession = async (req, res) => {
  try {
   const daysSession = await fetchCandidateJobSession(res, req.body.job_id);

   console.log("daysSession : ", daysSession);  
    if (daysSession.length === 0) {
        res.status(404).json(
          Response({
            success: false,
            message: "No Job Found",
            data: [],
          })
        );
      } else {
        res.status(200).json(
          Response({
            success: true,
            message: "Job Session Fetched",
            data: {day_Session:daysSession},
          })
        );
      }
  } catch (error) {
    // console.log(error)
    logger("user_job_session").error("System Error : ", error);
    return false;
  }
}

const addDaySession = async (req, res) => {

  // console.log("checkBooked : ", req.body.sessions.sessions);
  try {
    let days = req.body.sessions;
    console.log("days : ", days);
    
    days.sessions.forEach(async (manage) => {
      //*******Check first if the user already exists */
      const checkBooked = await db.query(
        `SELECT job_id FROM ${manage.day} WHERE job_id = ?`,
        [manage.job_id]
      );

      console.log("checkBooked : ", checkBooked);

      if (checkBooked.length > 0) {
        console.log("updated : ", true);
        return true;
        // const updateDaySession = await updateIniJobSession(res, manage);
        // logger("user_day_session_update").info("Update : ", updateDaySession);
      } else {
        console.log("Inserted : ", true);
        const insertGoJobDays = await insertJobDays(res, manage);
        res.status(200).json(
          Response({
            success: true
          })
        );
        // return true;
        // logger("user_day_session_insert").info("Insert : ", insertDaySession);
      }
    });

    return true;
  } catch (error) {
    // console.log(error)
    logger("user_job_session").error("System Error : ", error);
    return false;
  }
};

module.exports = {
  add,
  fetching,
  addJobDaySession,
  addInitialJobDaySession,
  addDaySession,
  addJobCompleted,
  JobDaySession,
  FetchDaySession,
};
