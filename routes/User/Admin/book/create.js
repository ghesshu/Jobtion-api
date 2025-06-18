const { Router } = require("express");
const { create } = require("../../../../controllers/Admin/bookController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.post(
  "/",verifyUser,
  body("job_id").notEmpty().withMessage("Job ID is required"),
  body("candidate_id").notEmpty().withMessage("Candidate ID is required"),
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await create(req, res)
    })();
  }
);

module.exports = router;
