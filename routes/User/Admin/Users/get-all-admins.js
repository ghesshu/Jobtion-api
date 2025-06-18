const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token');
const { fetchAdmins } = require("../../../../controllers/Admin/userController");


const router = Router({ strict: true });

router.get("/", verifyUser);

router.get(
  "/",
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await fetchAdmins(req, res)
    })();
  }
);

module.exports = router;
