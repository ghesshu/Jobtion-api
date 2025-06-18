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
    body("preference").notEmpty().withMessage("Preference id field is required"),
    body("time_manager").notEmpty().withMessage("Time Management field is required"),
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
        // const daysArray = req.body.preference_id;
        // console.log(req.body)

// Loop through the array
// daysArray.forEach((preference) => {
//   console.log(`Day: ${preference}`);
// });
      //****hitting the controller */
      await add(req, res);
    })();
  }
);

module.exports = router;
