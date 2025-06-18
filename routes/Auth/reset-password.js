const { Router } = require("express");
const { resetPassword } = require("../../controllers/Gen/authController");
const { body, validationResult } = require("express-validator");


const router = Router({ strict: true });

router.post(
  "/",
  [
    //** Validate and sanitize request body **/fcm_token
    body("email").isEmail().trim().notEmpty().withMessage("Email is required").escape(),
    body("code").trim().notEmpty().withMessage("Code is required").escape(),
    body("password").trim().notEmpty().withMessage("Password is required").escape(),
    body("confirm_password").trim().notEmpty().withMessage("Confirm Password is required").escape(),

    //* Handle validation errors **/
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
  ],
  (req, res) => {
    (async () => {
      //****hitting the controller */
      await resetPassword(req, res);
    })();
  }
);

module.exports = router;
