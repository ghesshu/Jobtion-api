const { Router } = require("express");
const { createAdmin } = require("../../../controllers/Gen/authController.js");
const { body, validationResult } = require("express-validator");


const router = Router({ strict: true });

router.post(
  "/",
  [
    //** Validate and sanitize request body **/fcm_token
    body("username").trim().notEmpty().withMessage("Username is required").escape(),
    body("full_name").trim().notEmpty().withMessage("Fullname is required").escape(),
    body("email").isEmail().trim().notEmpty().withMessage("Email is required").escape(),
    body("role_id").trim().notEmpty().withMessage("Role is required").escape(),
    body("password").notEmpty().withMessage("Password is required").escape(),

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
      await createAdmin(req, res);
    })();
  }
);

module.exports = router;
