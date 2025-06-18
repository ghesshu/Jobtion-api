const { Router } = require("express");
const { deleteUser } = require("../../../controllers/Gen/profileController.js");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../middlewares/token')


const router = Router({ strict: true });

// router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("email").notEmpty().withMessage("Email field is required"),
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
      const me = "lol";
      if(me === "admin"){
        await deleteUser(req, res);
      }
      else{
        res.status(401).json("Please don't ever try this again , else (*_*) !").end();
      }
      
    })();
  }
);

module.exports = router;
