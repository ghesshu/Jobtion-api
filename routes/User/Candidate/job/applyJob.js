const { Router } = require("express");
const { apply } = require("../../../../controllers/Candidate/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')

const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("job_id").trim().notEmpty().withMessage("Job ID is required").escape(),
    body("company_id").trim().notEmpty().withMessage("Company ID is required").escape(),
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
      res.locals.user_type === "Candidate"
        ? 
        //****hitting the controller */
         await apply(req, res, "application")
        : res
            .status(401)
            .json({
              success: false,
              message: "Can't access this route : User not a candidate",
            });
    })();
  }
);

module.exports = router;
