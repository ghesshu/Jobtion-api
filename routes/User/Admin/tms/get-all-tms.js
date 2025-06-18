const { Router } = require("express");
const { getAllTms } = require("../../../../controllers/Admin/tmsController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.get(
  "/",verifyUser,
  body("tsm_id").notEmpty().withMessage("Time sheet manager ID is required"),
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await getAllTms(req, res)
    })();
  }
);

module.exports = router;