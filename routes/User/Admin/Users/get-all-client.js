const { Router } = require("express");
const { fetchClients } = require("../../../../controllers/Admin/userController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.get("/", verifyUser);

router.get(
  "/",
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await fetchClients(req, res)
    })();
  }
);

module.exports = router;
