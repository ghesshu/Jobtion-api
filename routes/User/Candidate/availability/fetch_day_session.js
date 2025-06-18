const { Router } = require("express");
const { FetchDaySession } = require("../../../../controllers/Candidate/avalController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')


const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("job_id").notEmpty().withMessage("Job Id field is required"),
    //* Handle validation errors **/
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
  ],
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await FetchDaySession(req, res);
    })();
  }
);

module.exports = router;
