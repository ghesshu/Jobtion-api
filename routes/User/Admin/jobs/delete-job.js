const { Router } = require("express");
const { deleteJob } = require("../../../../controllers/Admin/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.delete("/", verifyUser);

router.delete(
  "/",
  (req, res) => {
    (async () => {
    //*****check user type first before hitting */
      await deleteJob(req, res)
    })();
  }
);

module.exports = router;
