const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {fetchForCompany, fetchAJobForCompany} = require("../../models/jobModel.js");

const add = async (req, res) => {
  try {
    //******old way */
    // const insert = await db.query("INSERT INTO posted_jobs(company,position,salary,location,job_type,job_desc,job_requirement) VALUES(?,?,?,?,?,?,?)",[
    //     res.locals.user_id.id,
    //     req.body.position,
    //     req.body.salary,
    //     req.body.location,
    //     req.body.job_type,
    //     req.body.job_desc,
    //     req.body.job_requirement,
    //   ],
    // );

    //*******new way */
    const  sql = "INSERT INTO posted_jobs(company,job_title,price_per_hour,employment_type,duty_1,duty_2,duty_3,duty_4,requirment_1,requirment_2,requirment_3,requirment_4) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
    const insert = await db.query(sql,[
      res.locals.user_id.id,
      req.body.job_title,
      req.body.price_per_hour,
      req.body.employment_type,
      req.body.duty_1,
      req.body.duty_2,
      req.body.duty_3,
      req.body.duty_4,
      req.body.requirment_1,
      req.body.requirment_2,
      req.body.requirment_3,
      req.body.requirment_4,
    ],
  );

    if (insert.affectedRows > 0) {
      //*****return all jobs added */
      const fetch = await fetchForCompany(req, res)

      res.status(201).json(
        Response({
          success: true,
          message: "Job Added",
          data: fetch,
        })
      );
    } else {
      logger("add_job").error("Job Bug : ", insert);
      res.status(422).json(
        Response({
          success: false,
          message: "Failed to add job",
        })
      );
    }
  } catch (error) {
    // console.log(error)
    logger("add_job").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: `System Error -  ${error}`,
      })
    );
  }
};

const edit = async (req, res) => {
  try {
    // const update = await db.query("UPDATE posted_jobs SET position = ? , salary = ?, location = ?, job_type = ? , job_desc = ? , job_requirement = ?  WHERE company = ? AND id = ?",[
    //     req.body.position,
    //     req.body.salary,
    //     req.body.location,
    //     req.body.job_type,
    //     req.body.job_desc,
    //     req.body.job_requirement,
    //     res.locals.user_id.id,
    //     req.body.id,
    //   ],
    // );

    const update = await db.query("UPDATE posted_jobs SET job_title = ? , price_per_hour = ?, employment_type = ?, duty_1 = ? , duty_2 = ? , duty_3 = ?, duty_4 = ?, requirment_1 = ?, requirment_2 = ?, requirment_3 = ?, requirment_4 = ? WHERE company = ? AND id = ?",[
      req.body.job_title,
      req.body.price_per_hour,
      req.body.employment_type,
      req.body.duty_1,
      req.body.duty_2,
      req.body.duty_3,
      req.body.duty_4,
      req.body.requirment_1,
      req.body.requirment_2,
      req.body.requirment_3,
      req.body.requirment_4,
        res.locals.user_id.id,
        req.body.id,
      ],
    );

    if (update.affectedRows > 0) {
      //*****return the updated job */
      const fetch = await fetchForCompany(req, res)

      res.status(201).json(
        Response({
          success: true,
          message: "Job Updated",
          data: fetch,
        })
      );
    } else {
      logger("update_job").error("Job Bug : ", update);
      res.status(422).json(
        Response({
          success: false,
          message: "Failed to update job",
        })
      );
    }
  } catch (error) {
    // console.log(error)
    logger("update_job").error("System Error : ", error);
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
    const del = await db.query("DELETE FROM  posted_jobs WHERE company = ? AND id = ?",[res.locals.user_id.id, req.body.id]);

    if (del.affectedRows > 0) {
      //*****return all jobs added */
      const fetch = await fetchForCompany(req, res)

      res.status(201).json(
        Response({
          success: true,
          message: "Job Deleted",
          data: fetch,
        })
      );
    } else {
      logger("delete_job").error("Job Bug : ", del);
      res.status(422).json(
        Response({
          success: false,
          message: "Failed to delete job",
        })
      );
    }
  } catch (error) {
    // console.log(error)
    logger("delete_job").error("System Error : ", error);
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
    const fetch = await fetchAJobForCompany(req, res)

    // console.log(fetch)

    console.log(req.body.id);

    res.status(201).json(
      Response({
        success: true,
        message: "Job Fetched",
        data: fetch,
      })
    );
  } catch (error) {
    logger("delete_job").error("System Error : ", error);
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
    const fetch = await await fetchForCompany(req, res)

    res.status(201).json(
      Response({
        success: true,
        message: "Job Fetched",
        data: fetch,
      })
    );
  } catch (error) {
    logger("delete_job").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

module.exports = { add, edit, del, fetchJob, fetch };
