const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {
  getAllPermanentJobs,
  getAllTemporaryJobs,
} = require("../../middlewares/jobMiddleware.js");

const fetchPermanentJobs = async (req, res) => {
  try {
    const fetchP = await getAllPermanentJobs(req, res);

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

const fetchTemporaryJobs = async (req, res) => {
  try {
    const fetchP = await getAllTemporaryJobs(req, res);

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

module.exports = { fetchPermanentJobs, fetchTemporaryJobs };
