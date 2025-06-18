const { Router } = require("express");
const { getWeeklyPayrollReport } = require("../../../../controllers/Admin/reportController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

// router.post("/", verifyUser);

router.post(
  "/",
  verifyUser,
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await getWeeklyPayrollReport(req, res)
    })();
  }
);

module.exports = router;