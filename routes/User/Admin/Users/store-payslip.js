const { Router } = require("express");
const { storePayslipData } = require("../../../../controllers/Admin/reportController");
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
      await storePayslipData(req, res)
    })();
  }
);

module.exports = router;