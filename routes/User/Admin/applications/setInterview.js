const { Router } = require("express");
const { SetInterview } = require("../../../../controllers/Admin/applicationController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.post(
  "/",verifyUser,
  [
  body("application_id").notEmpty().withMessage("Application ID is required"),
  body("interview_by").notEmpty().withMessage("Interview By is required"),
  body("interview_date").notEmpty().withMessage("Interview Date is required"),
  body("interview_time").notEmpty().withMessage("Interview Time is required"),
  ],
  (req, res) => {
    (async () => {
    //     const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ success: false, errors: errors.array() });
    //   }
      //****hitting the controller */
      await SetInterview(req, res)
    })();
  }
);

module.exports = router;