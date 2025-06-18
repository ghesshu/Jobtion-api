const { Router } = require("express");
const { edit } = require("../../../../controllers/Client/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')


const router = Router({ strict: true });

router.patch("/", verifyUser);

router.patch(
  "/",
  [
    //** Validate and sanitize request body **/
    body("id").trim().notEmpty().withMessage("Job ID field is required").escape(),
    body("position").trim().notEmpty().withMessage("position field is required").escape(),
    body("salary").trim().notEmpty().withMessage("salary field is required").escape(),
    body("location").trim().notEmpty().withMessage("location field is required").escape(),
    body("job_type").trim().notEmpty().withMessage("job_type field is required").escape(),
    body("job_desc").trim().notEmpty().withMessage("job_desc field is required").escape(),
    body("job_requirement").trim().notEmpty().withMessage("job_requirement field is required").escape(),
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
    //*****check user type first before hitting */
    res.locals.user_type === 'Client' ?
      //****hitting the controller */
      await edit(req, res)
      :
      res.status(401).json({"success":false, message:"Can't access this route : User not a client"})
    })();
  }
);

module.exports = router;
