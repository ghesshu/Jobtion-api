const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {fetchAllJobs, fetchAJob, fetchJobApplications, fetchJobApplicationsStatus} = require("../../models/jobModel.js");

const fetchAll = async(req,res) => {
    try {
        const touch = await fetchAllJobs(req,res)

            if(touch !== false){
                res.status(201).json(
                    Response({
                      success: true,
                      message: "Job fetched",
                      data:touch
                    })
                  );
            }
            else{
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
}

const fetch = async(req,res) => {
    try {
        const touch = await fetchAJob(req,res)
            if(touch !== false){
                res.status(201).json(
                    Response({
                      success: true,
                      message: "Job fetched",
                      data: touch
                    })
                  );
            }
            else{
                res.status(422).json(
                    Response({
                      success: false,
                      message: "Failed to fetch a job",
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
}

const apply = async(req, res) => {
  try {
    
    //******check if the job exists */
    const jobCheck = await db.query("SELECT id FROM posted_jobs WHERE id = ?", [req.body.job_id]);

    if (jobCheck.length > 0) {
      const applyCheck = await db.query("SELECT candidate FROM applications WHERE candidate = ? AND job = ?", [res.locals.user_id.id, req.body.job_id]);

      if (applyCheck.length > 0) {
        res.status(422).json(
          Response({
            success: false,
            message: `Sorry you have already applied for this job`,
          })
        );
      }
      else{
        const sql = "INSERT INTO applications(candidate, job, company) VALUES(?,?,?)";
        const values = [res.locals.user_id.id, req.body.job_id, req.body.company_id];
        const insert = await db.query(sql,values);

      if(insert.affectedRows > 0){
        const touch = await fetchJobApplications(req,res)
        res.status(201).json(
          Response({
            success: true,
            message: "Job Applied",
            data: touch
          })
        );
      }
      else{
        logger("apply_a_job").error("Job Application : ", `${error}`);
          res.status(422).json(
              Response({
                success: false,
                message: `Error - ${insert}`,
              })
            );
      }
      }

      
    }
    else{
        res.status(422).json(
            Response({
              success: false,
              message: `No posted job found for this job title`,
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
}

const fetchApplyJob = async(req, res) => {
  try {
    
    //******check if the job exists */
    const jobCheck = await db.query("SELECT id FROM applications WHERE candidate = ?", [res.locals.user_id.id]);

    if (jobCheck.length > 0) {
      const touch = await fetchJobApplicationsStatus(req,res)
      res.status(201).json(
        Response({
          success: true,
          message: "Job Fetched",
          data: touch
        })
      );
    }
    else{
        res.status(422).json(
            Response({
              success: false,
              message: `No posted job found for this job title`,
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
}

module.exports = {fetchAll, fetch, apply, fetchApplyJob}