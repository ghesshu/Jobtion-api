const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const { fetch } = require("../../models/bookModel.js");
const {
  Email,
  ApplicationEmail,
  SMS,
} = require("../../middlewares/notificationMiddleware.js");
const { apply } = require("./jobController.js");

const book = async (req, res) => {
  try {
    const status = req.body.status;

    if (status === "accepted") {
     //******check if user is already booked */
      const check = await db.query("SELECT job, candidate FROM bookings WHERE candidate = ? AND job = ?", [
        res.locals.user_id.id,
        req.body.job_id,
      ]);

      if (check.length > 0) {
        apply(req, res, "book");
      } else {
        res.status(422).json(
          Response({
            success: false,
            message: "You have not booked this job yet",
            data: [],
          })
        );
      }
    } else if (status === "declined") {
      //******check if job_id is in the booking table */
      const check = await db.query("SELECT job FROM bookings WHERE job = ?", [
        req.body.job_id,
      ]);
      if (check.length > 0) {
        const jobCheck = await db.query(
          "SELECT id,job_title FROM posted_jobs WHERE id = ? AND company = ?",
          [req.body.job_id, req.body.company_id]
        );
        //*******user declined */
        $request = await db.query(
          "UPDATE bookings SET candidate_status = ?, booking_status = ? WHERE candidate = ? AND job = ?",
          ["declined", "declined", res.locals.user_id.id, req.body.job_id]
        );

        if ($request.affectedRows > 0) {
          //*****send a notification via mail or sms for the applied job
          const message = `Dear ${res.locals.full_name}, <br/> <br/> 
            <p>You declined a job position : ${jobCheck[0].job_title} via our Jobtion.<br/></p>
            <p></p>
            <p>If you have any questions in the meantime, please feel free to reach out to us at [contact email/phone number].<br/></p>
            <p>Thank you once again for declining, and we wish you the best of luck.<br/></p>
            Kind regards<br/>
            Quint Education`;

          const message_ = `Candidate ${res.locals.full_name}, <br/> <br/> 
            <p>Declined Job position : ${jobCheck[0].job_title}  via our Jobtion.<br/></p>
            <p></p>`;

          ApplicationEmail(req.email, message, jobCheck[0].job_title);
          Email("duffy@quinteducation.co.uk", message_, jobCheck[0].job_title);
          res.status(201).json(
            Response({
              success: true,
              message: "Declined",
              data: [],
            })
          );
        } else {
          res.status(422).json(
            Response({
              success: false,
              message: "You have booking for this job",
              data: [],
            })
          );
        }
      } else {
        res.status(422).json(
          Response({
            success: false,
            message:
              "There was error processing your request, please try again later",
            data: [],
          })
        );
      }
    }
  } catch (error) {
    logger("candidate_book").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const fetch_Booking = async (req, res) => {
  try {
    //*****return all jobs added */
    const response = await fetch(req, res);

    // console.log(response)
    res.status(201).json(
      Response({
        success: true,
        message: "Bookings fetched",
        data: response,
      })
    );
  } catch (error) {
    logger("candidate_fetch_book").error("System Error : ", error);
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

module.exports = { book, fetch_Booking };
