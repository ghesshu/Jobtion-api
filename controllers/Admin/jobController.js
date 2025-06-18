const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const axios = require('axios');
const { getAllPermanentJobs, getAllTemporaryJobs, getAllJobs  } = require("../../middlewares/jobMiddleware.js");
const { config } = require("dotenv");
config();


// const fetchPermanentJobs = async (req, res) => {
//     try {
      
//       const fetchP = await getAllPermanentJobs(req, res);
      
//       console.log(fetchP);

//       res.status(200).json(
//         Response({
//           success: true,
//           message: "Fetched",
//           data: fetchP,
//         })
//       );
//     } catch (error) {
//       // console.log(error)
//       logger("user_avail").error("System Error : ", error);
//       res.status(500).json(
//         Response({
//           success: false,
//           message: `System Error : ${error}`,
//         })
//       );
//     }
//   };

// const fetchTemporaryJobs = async (req, res) => {
//     try {
      
//       const fetchP = await getAllTemporaryJobs(req, res);
      
//       console.log(fetchP);

//       res.status(200).json(
//         Response({
//           success: true,
//           message: "Fetched",
//           data: fetchP,
//         })
//       );
//     } catch (error) {
//       // console.log(error)
//       logger("user_avail").error("System Error : ", error);
//       res.status(500).json(
//         Response({
//           success: false,
//           message: `System Error : ${error}`,
//         })
//       );
//     }
// };

const fetchPermanentJobs = async (req, res) => {
  try {
    const Response_ = await axios.post(`${res.locals.uzziel}applications`, {type:'pm'}, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log(Response_.status)
    if (Response_.status !== 200) {
      console.log(Response_.data.applications)
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
        })
      );
    }
    else {
      res.status(201).json(
        Response({
          success: true,
          message: "JApplications Fetched Successfully",
          data: Response_.data.applications
        })
      );
    }
  } catch (error) {
    console.log(error.message)
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.status || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  };
    // }
  };

const fetchTemporaryJobs = async (req, res) => {
  try {
    const Response_ = await axios.post(`${res.locals.uzziel}applications`, {type:'bk'}, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log(Response_.status)
    if (Response_.status !== 200) {
      console.log(Response_.data.applications)
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
        })
      );
    }
    else {
      res.status(201).json(
        Response({
          success: true,
          message: "JApplications Fetched Successfully",
          data: Response_.data.applications
        })
      );
    }
  } catch (error) {
    console.log(error.message)
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.status || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const fetchAllJobs = async (req, res) => {
  try {
    
    const fetchP = await getAllJobs(req, res);
    
    console.log(fetchP);

    res.status(200).json(
      Response({
        success: true,
        message: "Fetched",
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

const postJob = async (req, res) => {
  try {
    const Response_ = await axios.post(`${res.locals.uzziel}jobs`, req.body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!Response_.data.success) {
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
        })
      );
    }
    else {
      res.status(201).json(
        Response({
          success: true,
          message: "Job Created Successfully",
          data: Response_.data.data
        })
      );
    }
  } catch (error) {
    // console.log(Response_)
    logger("post_job").error("System Error:", error.message);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const updateJob = async (req, res) => {
  try {
    const Response_ = await axios.put(`${res.locals.uzziel}jobs/${req.body.id}`, req.body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!Response_.data.success) {
      console.log(Response_.data)
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
        })
      );
    }
    else {
      res.status(201).json(
        Response({
          success: true,
          message: "Job Update Successfully",
          data: Response_.data.data
        })
      );
    }
  } catch (error) {
    console.log(error.message)
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const deleteJob = async (req, res) => {
  try {
    const Response_ = await axios.delete(`${res.locals.uzziel}jobs/${req.body.id}`, {
      data: req.body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!Response_.data.success) {
      console.log(Response_.data)
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
        })
      );
    }
    else {
      res.status(201).json(
        Response({
          success: true,
          message: "Job Deleted Successfully",
          data: Response_.data.data
        })
      );
    }
  } catch (error) {
    console.log(error.message)
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const showJob = async (req, res) => {
  try {
    const Response_ = await axios.get(`${res.locals.uzziel}jobs/${parseInt(req.body.id)}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!Response_.data.success) {
      console.log(Response_.data)
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
          data: Response_.data.data
        })
      );
    }
    else {
      // console.log("okay ::;",Response_)
      res.status(200).json(
        Response({
          success: true,
          message: "Job Fetched Successfully",
          data: Response_.data.job
        })
      );
    }
  } catch (error) {
    console.log(error.message)
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const publishJob = async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE posted_jobs SET status = ? WHERE id = ?",
      [req.body.publish, req.body.id]
    );

    if (response.affectedRows === 0) {
      return res.status(422).json(
        Response({
          success: false,
          message: "Job not found",
        })
      );
    }
    else {
      return res.status(200).json(
        Response({
          success: true,
          message: "Job Status Updated Successfully",
        })
      );
    }
  } catch (error) {
    
  }
}
  module.exports = {fetchPermanentJobs, fetchTemporaryJobs, fetchAllJobs, postJob, updateJob, deleteJob, showJob, publishJob}