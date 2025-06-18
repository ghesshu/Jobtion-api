const { Router } = require("express");
const { del } = require("../../../../controllers/Candidate/qualificationController.js");
const { body, validationResult } = require("express-validator");
const verifyUser = require("../../../../middlewares/token");
const Response = require("../../../../utils/standardResponse.js");

const router = Router({ strict: true });

router.delete("/", verifyUser);

//***************validate fields */
router.delete(
  "/",
  [
    //** Validate and sanitize request body **/
    body("id").trim().notEmpty().withMessage("Id field is required"),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await del(req, res);
    })();
  }
);

module.exports = router;
