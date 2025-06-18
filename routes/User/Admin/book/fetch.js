const { Router } = require("express");
const { fetch } = require("../../../../controllers/Admin/bookController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.get(
  "/",verifyUser,
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await fetch(req, res)
    })();
  }
);

module.exports = router;
