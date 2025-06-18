const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const axios = require('axios');
const { config } = require("dotenv");
config();

const update = async (req, res) => {
    try {
      const Response_ = await axios.post(`${res.locals.uzziel}candidates/update_tsm`, {
        tsm_id: req.body.tsm_id,
        start: req.body.start,
        end: req.body.end,
        break_time: req.body.break_time,
        amount: req.body.amount,
        location: req.body.location,
        }, 
        {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(Response_.data)
      if (Response_.data.success === false) {
        return res.status(422).json(
          Response({
            success: false,
            message: Response_.data.message,
          })
        );
      }
      else {
        res.status(201).json(
          Response({
            success: true,
            message: Response_.data.message,
            data: []
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

const approve = async (req, res) => {
    try {
    const Response_ = await axios.post(`${res.locals.uzziel}candidates/${req.body.tsm_id}/approve_tsm`, 
        {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });
    
    if (Response_.status !== 200 && Response_.status === 201) {
        return res.status(422).json(
        Response({
            success: false,
            message: Response_.data.message,
        })
        );
    }
    else {
        res.status(201).json(
        Response({
            success: true,
            message: Response_.data.message,
            data: []
        })
        );
    }
    } catch (error) {
    console.log(error.message)
    res.status(error.response?.status || 500).json(
        Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
        })
    );
    }
};

const reject = async (req, res) => {
    try {
    const Response_ = await axios.post(`${res.locals.uzziel}candidates/${req.body.tsm_id}/reject_tsm`, 
        {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });
    
    if (Response_.status !== 200 && Response_.status === 201) {
        return res.status(422).json(
        Response({
            success: false,
            message: Response_.data.message,
        })
        );
    }
    else {
        res.status(201).json(
        Response({
            success: true,
            message: Response_.data.message,
            data: []
        })
        );
    }
    } catch (error) {
    console.log(error.message)
    res.status(error.response?.status || 500).json(
        Response({
        success: false,
        message: error.response?.body?.message || "Internal Server Error",
        })
    );
    }
};

const getAllTms = async (req, res) => {
  try {
  const Response_ = await axios.post(`${res.locals.uzziel}candidates/get-all-timesheets`, 
      {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
  });
  
  if (Response_.status !== 200) {
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
          message: "Time Sheet Manager Fetched Successfully",
          data: Response_.data
      })
      );
  }
  } catch (error) {
  console.log(error.message)
  res.status(error.response?.status || 500).json(
      Response({
      success: false,
      message: error.response?.body?.message || "Internal Server Error",
      })
  );
  }
};

module.exports = { update, approve, reject, getAllTms };