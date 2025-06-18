const { Router } = require("express");
const { fetchSingle } = require("../../../../controllers/Candidate/qualificationController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')

const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
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
  
        await fetchSingle(req, res);
      })();
    }
  );

module.exports = router;
