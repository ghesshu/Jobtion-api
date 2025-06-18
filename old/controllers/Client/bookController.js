const Response = require("../../utils/standardResponse.js");
const logger = require ('../../utils/logger.js');
const executeQuery = require("../../db/serverless_connection.js");

const add = async (req, res) => {
  try {
    const insert = await executeQuery({
        query: `INSERT INTO bookings(company,candidate,job) VALUES(?,?,?)`,
        values: [res.locals.user_id.id, req.body.candidate, req.body.job],
      });

      if (insert.affectedRows > 0) {
        //*****return all jobs added */
        // const fetch = await executeQuery({
        //     query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
        //     values: [res.locals.user_id.id],
        //   });

        res.status(201).json(
            Response({
              success: true,
              message: "Booking Created",
            //   data:fetch
            })
          );
      }
      else{
        logger("add_bookings").error('Book Bug : ', insert)
        res.status(422).json(
            Response({
              success: false,
              message: "Failed to add bookings",
            })
          );
      }
    }
   catch (error) {
    // console.log(error)
    logger("add_bookings").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const edit = async (req, res) => {
  try {
    const update = await executeQuery({
        query: `UPDATE bookings SET candidate = ? , job = ? WHERE company = ? AND id = ?`,
        values: [req.body.candidate, req.body.job, res.locals.user_id.id, req.body.id],
      });

      if (update.affectedRows > 0) {
        //*****return the updated job */
        // const fetch = await executeQuery({
        //     query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
        //     values: [res.locals.user_id.id, req.body.id],
        //   });

        res.status(201).json(
            Response({
              success: true,
              message: "Booking Updated",
            //   data:fetch
            })
          );
      }
      else{
        logger("update_bookings").error('Book Bug : ', update)
        res.status(422).json(
            Response({
              success: false,
              message: "Failed to update job",
            })
          );
      }

  } catch (error) {
    // console.log(error)
    logger("update_bookings").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const del = async (req, res) => {
  try {
    const del = await executeQuery({
        query: `DELETE FROM  bookings WHERE company = ? AND id = ?`,
        values: [res.locals.user_id.id, req.body.id],
      });

      if (del.affectedRows > 0) {
        //*****return all jobs added */
        // const fetch = await executeQuery({
        //     query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
        //     values: [res.locals.user_id.id],
        //   });

        res.status(201).json(
            Response({
              success: true,
              message: "Book Deleted",
            //   data:fetch
            })
          );
      }
      else{
        logger("delete_bookings").error('Job Bug : ', del)
        res.status(422).json(
            Response({
              success: false,
              message: "Failed to delete booking",
            })
          );
      }


  } catch (error) {
    // console.log(error)
    logger("delete_bookings").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const fetchBook = async (req, res) => {
    try {
       //*****return all jobs added */
       const fetch = await executeQuery({
        query: `SELECT * FROM bookings_view WHERE company_id = ? AND id = ?`,
        values: [res.locals.user_id.id, req.body.id],
      });

          res.status(201).json(
              Response({
                success: true,
                message: "Book Fetched",
                data:fetch
              })
            );
  
  
    } catch (error) {
      logger("fetch_book").error('System Error : ',  error)
      res.status(500).json(
        Response({
          success: false,
          message: "System Error",
        })
      );
    }
  };

const fetch = async (req, res) => {
    try {
       //*****return all jobs added */
       const fetch = await executeQuery({
        query: `SELECT * FROM bookings_view WHERE company_id = ?`,
        values: [res.locals.user_id.id],
      });

          res.status(201).json(
              Response({
                success: true,
                message: "Bookings fetched",
                data:fetch
              })
            );
  
  
    } catch (error) {
      logger("fetch_book").error('System Error : ',  error)
      res.status(500).json(
        Response({
          success: false,
          message: "System Error",
        })
      );
    }
  };



module.exports = { add, edit, del, fetchBook, fetch  };
