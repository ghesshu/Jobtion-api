const { Router } = require("express");
const { signup } = require("../../controllers/Gen/authController");
const { body, validationResult } = require("express-validator");


const router = Router({ strict: true });

router.post(
  "/",
  [
    //** Validate and sanitize request body **/fcm_token
    body("user_type").trim().notEmpty().withMessage("User Type is required").escape(),
    body("first_name").trim().notEmpty().withMessage("First Name is required").escape(),
    body("email").isEmail().trim().notEmpty().withMessage("Email is required").escape(),
    body("password").notEmpty().withMessage("Password is required").escape(),
    body("phone_number").custom((value) => {
      if (!value || isNaN(value)) {
        throw new Error("Mobile number must be numeric");
      }
      return true;
    }),

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
      await signup(req, res);
    })();
  }
);

module.exports = router;
