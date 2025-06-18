const { Router } = require("express");
const { verify } = require("../../controllers/Gen/otpController");
const { body, validationResult } = require("express-validator");
const verifyUser = require("../../middlewares/token");
const logger = require("../../utils/logger");

const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    // body("phone_number").custom((value) => {
    //     if (!value || isNaN(value)) {
    //       throw new Error("Phone number must be numeric");
    //     }
    //     return true;
    //   }),
    body("code").custom((value) => {
      if (!value || isNaN(value)) {
        throw new Error("Code must be numeric");
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
      const postData = {
        body: req.body,
        user_id: res.locals.user_id,
      };
      logger("verification_post_data").info("Data : ", postData);
      //****hitting the controller */
      await verify(req, res, 'verify');
    })();
  }
);

module.exports = router;
