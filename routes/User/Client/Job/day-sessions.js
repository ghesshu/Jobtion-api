const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token');
const { addDaySession } = require("../../../../controllers/Candidate/avalController");


const router = Router({ strict: true });

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    // body("day").trim().notEmpty().withMessage("Day field is required").escape(),
    // body("start_at").trim().notEmpty().withMessage("Start field is required").escape(),
    // body("start_end").trim().notEmpty().withMessage("End field is required").escape(),
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
      await addDaySession(req, res)
    })();
  }
);

module.exports = router;
