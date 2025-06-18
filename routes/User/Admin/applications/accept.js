const { Router } = require("express");
const { accept_Application } = require("../../../../controllers/Admin/applicationController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.post(
  "/",verifyUser,
  body("id").notEmpty().withMessage("Application ID is required"),
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await accept_Application(req, res)
    })();
  }
);

module.exports = router;
