const { Router } = require("express");
const { add } = require("../../../../controllers/Candidate/avalController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')


const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    // body("available").trim().notEmpty().withMessage("Activity field is required").escape(),
    body("days").trim().notEmpty().withMessage("Days field is required").escape(),
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
        console.log(req.body)
        const daysArray = req.body.days;

// Loop through the array
daysArray.forEach((day) => {
  console.log(`Day: ${day.day}, Start Time: ${day.start_time}, End Time: ${day.end_time}`);
});
      //****hitting the controller */
      // await add(req, res);
    })();
  }
);

module.exports = router;
