const { Router } = require("express");
const { decline } = require("../../../../controllers/Admin/applicationController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.post(
  "/",verifyUser,
  body("id").notEmpty().withMessage("Application ID is required"),
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await decline(req, res)
    })();
  }
);

module.exports = router;
