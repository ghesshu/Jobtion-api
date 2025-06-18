const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const axios = require('axios');
const { config } = require("dotenv");
config();

const create = async (req, res) => {
    try {
      const Response_ = await axios.post(`${res.locals.uzziel}bookings`,
        {
        availability_id: req.body.availability_id,
        day: req.body.day,
        job_id: req.body.job_id,
        candidate_id: req.body.candidate_id,
        },
        {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(Response_.status)
      if (Response_.status === 202) {
        return res.status(422).json(
          Response({
            success: false,
            message: "Candidate already booked for this day/job",
          })
        );
      }
      if (Response_.status !== 200) {
        return res.status(422).json(
          Response({
            success: false,
            message: Response_.message
          })
        );
      }
      else {
        res.status(201).json(
          Response({
            success: true,
            message: "Bookings Created Successfully",
            data: []
          })
        );
      }
    } catch (error) {
      console.log(error.status)
      if (error.status === 404) {
        res.status(404).json(
            Response({
              success: false,
              message: "No Job Found",
            })
          );
      }
      else if (error.status === 400) {
            res.status(404).json(
                Response({
                  success: false,
                  message: "No Candidate Found",
                })
              );
      }
      else{
        res.status(error.response?.status || 500).json(
            Response({
              success: false,
              message: error.response?.body?.message || "Internal Server Error",
            })
          );
      }
      
    }
};

const delete_ = async (req, res) => {
    try {
      const Response_ = await axios.delete(`${res.locals.uzziel}bookings/${req.body.id}`, 
        {
        // data: req.body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(Response_.status)
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
            message: "Bookings Deleted Successfully",
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

const fetch = async (req, res) => {
    try {
      const Response_ = await axios.get(`${res.locals.uzziel}bookings`, 
        {
        // data: req.body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(Response_.status)
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
            message: "Bookings Fetched Successfully",
            data: Response_.data.bookings
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

module.exports = { create, delete_, fetch };