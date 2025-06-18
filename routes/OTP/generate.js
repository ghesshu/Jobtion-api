const { Router } = require("express");
const { generate } = require("../../controllers/Gen/otpController");
const { body, validationResult } = require("express-validator");
const verifyUser = require("../../middlewares/token");

const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("phone_number").notEmpty().withMessage("Phone number is required"),
  ],
  (req, res) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      //****hitting the controller */
      await generate(req, res);
    })();
  }
);

module.exports = router;
