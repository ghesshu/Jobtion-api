const { Router } = require("express");
const { fetchApplyJob } = require("../../../../controllers/Candidate/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')

const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("status").trim().notEmpty().withMessage("Status is required").escape(),
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
         await fetchApplyJob(req, res)
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
