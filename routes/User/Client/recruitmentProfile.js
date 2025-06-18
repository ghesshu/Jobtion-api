const { Router } = require("express");
const { createUserProfile } = require("../../../controllers/Gen/profileController");
const { body, validationResult } = require("express-validator");
const { storage, fileFilter } = require("../../../utils/upload_function/recuritementUpload");
const multer = require("multer");

const router = Router({ strict: true });

const upload = multer({ storage: storage, fileFilter: fileFilter });

//***************validate fields */
router.post(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("company_name").trim().notEmpty().withMessage("Company name is required").escape(),
    body("last_name").trim().notEmpty().withMessage("Last Name required").escape(),
    body("address").trim().notEmpty().withMessage("Address required").escape(),
    body("crn").notEmpty().withMessage("CRN is required"),
    body("urn").trim().notEmpty().withMessage("URN is required").escape(),
    body("about_me").notEmpty().withMessage("About Me required").escape(),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await createUserProfile(req, res);
    })();
  }
);

module.exports = router;
