const { Router } = require("express");
const { delete_ } = require("../../../../controllers/Admin/bookController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/admin-token')


const router = Router({ strict: true });

router.delete(
  "/",verifyUser,
  body("id").notEmpty().withMessage("Booking ID is required"),
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await delete_(req, res)
    })();
  }
);

module.exports = router;
