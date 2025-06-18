const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require('../../db/connection_new.js');
const { insert, update, fetch } = require("../../middlewares/availabilityMiddleware.js");

const add = async (req, res) => {
  try {
    let counter = req.body.time_manager.length;

    //*******get all selected preference */
    const selectedPreference =  req.body.preference[0]

    await db.query(`UPDATE preferences SET full_time = ? , part_time = ?, term_time = ?, after = ?  WHERE user_id = ?`,
    [selectedPreference.full_time,selectedPreference.part_time,selectedPreference.term_time,selectedPreference.after,res.locals.user_id.id]);


    req.body.time_manager.forEach(async (manage) => {
        //*******Check first if the user already exists */
        const checkBooked = await db.query(`SELECT user_id FROM ${manage.day} WHERE user_id = ?`,[res.locals.user_id.id])

        if (checkBooked.length > 0) {
           const updateAvail = await update(res,req,manage)
           logger("user_availability_update").info("Update : ", updateAvail);
        }
        else{
           const insertAvail = await insert(res,req,manage)
           logger("user_availability_insert").info("Update : ", insertAvail);
        }

        counter --;


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
    const fetchP = await fetch(res,req)

    res.status(201).json(
      Response({
        success: true,
        message: "Availability Fetched",
        data:fetchP
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

module.exports = { add, fetching };
