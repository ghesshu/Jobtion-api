const { Router } = require("express");
const { postJob } = require("../../../../controllers/Admin/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("job_title").notEmpty().withMessage("job field is required").escape(),
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
      await postJob(req, res)
    })();
  }
);

module.exports = router;
