const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const axios = require("axios");
const {
  getAllPermanentJobs,
  getAllTemporaryJobs,
  getAllJobs,
} = require("../../middlewares/jobMiddleware.js");
const { config } = require("dotenv");
config();

const fetch = async (req, res) => {
  try {
    const Response_ = await axios.post(
      `${res.locals.uzziel}applications`,
      { type: "all" },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(Response_.status);
    if (Response_.status !== 200) {
      console.log(Response_.data.applications);
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
        })
      );
    } else {
      res.status(201).json(
        Response({
          success: true,
          message: "JApplications Fetched Successfully",
          data: Response_.data.applications,
        })
      );
    }
  } catch (error) {
    console.log(error.message);
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.status || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
  // try {

  //   const fetchP = await getAllPermanentJobs(req, res);

  //   console.log(fetchP);

  //   res.status(200).json(
  //     Response({
  //       success: true,
  //       message: "Fetched",
  //       data: fetchP,
  //     })
  //   );
  // } catch (error) {
  //   // console.log(error)
  //   logger("user_avail").error("System Error : ", error);
  //   res.status(500).json(
  //     Response({
  //       success: false,
  //       message: `System Error : ${error}`,
  //     })
  //   );
  // }
};

const decline = async (req, res) => {
  try {
    const Response_ = await axios.post(
      `${res.locals.uzziel}applications/${req.body.id}/decline`,
      {
        data: req.body,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (Response_.data.success === false) {
      console.log(Response_.data);
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.message,
        })
      );
    } else {
      res.status(201).json(
        Response({
          success: true,
          message: Response_.data.message,
          data: null,
        })
      );
    }
  } catch (error) {
    console.log(error.message);
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const accept_Application = async (req, res) => {
  try {
    const Response_ = await axios.post(
      `${res.locals.uzziel}applications/${req.body.id}/accept`,
      {
        data: req.body,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (Response_.data.success === false) {
      console.log(Response_.data);
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.message,
        })
      );
    } else {
      res.status(201).json(
        Response({
          success: true,
          message: Response_.data.message,
          data: null,
        })
      );
    }
  } catch (error) {
    console.log(error.message);
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

const SetInterview = async (req, res) => {
  try {
    const Response_ = await axios.post(
      `${res.locals.uzziel}applications/${req.body.application_id}/interview`,
      {
        interview_by: req.body.interview_by,
        interview_date: req.body.interview_date,
        interview_time: req.body.interview_time,
        interview_link: req.body.interview_link,
        // data: req.body,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (Response_.data.success === false) {
      console.log(Response_.status);
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.message,
        })
      );
    } else {
      res.status(201).json(
        Response({
          success: true,
          message: Response_.data.message,
          data: null,
        })
      );
    }
  } catch (error) {
    
    console.log(error.message);
    // logger("post_job").error("System Error:", error);
    res.status(error.response?.statusCode || 500).json(
      Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
      })
    );
  }
};

module.exports = { fetch, decline, accept_Application, SetInterview };
