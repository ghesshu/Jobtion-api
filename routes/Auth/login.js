const { Router } = require("express");
const { login } = require("../../controllers/Gen/authController");
const { body, validationResult } = require("express-validator");

const router = Router({ strict: true });

router.post('/',[
    //** Validate and sanitize request body **/
    body("email").isEmail().trim().notEmpty().withMessage("Email is required").escape(),
    body("password").notEmpty().withMessage("Password is required").escape(),

    //* Handle validation errors **/
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
  ] , (req, res) => {
    (async () => {
        //****hitting the controller */
        await login(req, res);
      })();
})

module.exports = router;