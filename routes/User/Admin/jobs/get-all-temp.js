const { Router } = require("express");
const { fetchTemporaryJobs } = require("../../../../controllers/Admin/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.get("/", verifyUser);

router.get(
  "/",
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await fetchTemporaryJobs(req, res)
    })();
  }
);

module.exports = router;
