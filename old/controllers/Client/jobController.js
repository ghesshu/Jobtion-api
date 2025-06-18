const Response = require("../../utils/standardResponse.js");
const logger = require ('../../utils/logger.js');
const executeQuery = require("../../db/serverless_connection.js");

const add = async (req, res) => {
  try {
    const insert = await executeQuery({
        query: `INSERT INTO posted_jobs(company,position,salary,location,job_type,job_desc,job_requirement) VALUES(?,?,?,?,?,?,?)`,
        values: [res.locals.user_id.id, req.body.position, req.body.salary, req.body.location, req.body.job_type, req.body.job_desc, req.body.job_requirement],
      });

      if (insert.affectedRows > 0) {
        //*****return all jobs added */
        const fetch = await executeQuery({
            query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
            values: [res.locals.user_id.id],
          });

        res.status(201).json(
            Response({
              success: true,
              message: "Job Added",
              data:fetch
            })
          );
      }
      else{
        logger("add_job").error('Job Bug : ', insert)
        res.status(422).json(
            Response({
              success: false,
              message: "Failed to add job",
            })
          );
      }
    }
   catch (error) {
    // console.log(error)
    logger("add_job").error('System Error : ',  error)
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
        query: `UPDATE posted_jobs SET position = ? , salary = ?, location = ?, job_type = ? , job_desc = ? , job_requirement = ?  WHERE company = ? AND id = ?`,
        values: [req.body.position, req.body.salary, req.body.location, req.body.job_type, req.body.job_desc, req.body.job_requirement, res.locals.user_id.id, req.body.id],
      });

      if (update.affectedRows > 0) {
        //*****return the updated job */
        const fetch = await executeQuery({
            query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
            values: [res.locals.user_id.id, req.body.id],
          });

        res.status(201).json(
            Response({
              success: true,
              message: "Job Updated",
              data:fetch
            })
          );
      }
      else{
        logger("update_job").error('Job Bug : ', update)
        res.status(422).json(
            Response({
              success: false,
              message: "Failed to update job",
            })
          );
      }

  } catch (error) {
    // console.log(error)
    logger("update_job").error('System Error : ',  error)
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
        query: `DELETE FROM  posted_jobs WHERE company = ? AND id = ?`,
        values: [res.locals.user_id.id, req.body.id],
      });

      if (del.affectedRows > 0) {
        //*****return all jobs added */
        const fetch = await executeQuery({
            query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
            values: [res.locals.user_id.id],
          });

        res.status(201).json(
            Response({
              success: true,
              message: "Job Deleted",
              data:fetch
            })
          );
      }
      else{
        logger("delete_job").error('Job Bug : ', del)
        res.status(422).json(
            Response({
              success: false,
              message: "Failed to delete job",
            })
          );
      }


  } catch (error) {
    // console.log(error)
    logger("delete_job").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const fetchJob = async (req, res) => {
  try {
     //*****return all jobs added */
     const fetch = await executeQuery({
      query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ? AND id = ?`,
      values: [res.locals.user_id.id, req.body.id],
    });

    console.log(fetch)

    console.log(req.body.id)

        res.status(201).json(
            Response({
              success: true,
              message: "Job Fetched",
              data:fetch
            })
          );


  } catch (error) {
    logger("delete_job").error('System Error : ',  error)
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
        query: `SELECT position, salary, job_type FROM posted_jobs WHERE company = ?`,
        values: [res.locals.user_id.id],
      });

          res.status(201).json(
              Response({
                success: true,
                message: "Job Deleted",
                data:fetch
              })
            );
  
  
    } catch (error) {
      logger("delete_job").error('System Error : ',  error)
      res.status(500).json(
        Response({
          success: false,
          message: "System Error",
        })
      );
    }
  };



module.exports = { add, edit, del, fetchJob ,fetch  };
