const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token.js');
const { getRoles } = require("../../../../controllers/Admin/roleController.js");


const router = Router({ strict: true });

router.get("/", verifyUser);

router.get(
  "/",
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await getRoles(req, res)
    })();
  }
);

module.exports = router;
