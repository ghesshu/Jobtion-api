const { Router } = require("express");
const { body, validationResult } = require("express-validator");
// const { storage, fileFilter } = require("../../../../../utils/upload_function/recuritementUpload");
const { storage, fileFilter } = require("../../../../../utils/storageConfig.js");

const multer = require("multer");
const verifyUser = require("../../../../../middlewares/token.js");
const { fetchUserByEmailOrID } = require("../../../../../models/userModel.js");
const { addNewClient } = require("../../../../../controllers/Admin/userController_new.js");

const router = Router({ strict: true });

router.post("/", verifyUser);

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

//***************validate fields */
router.post(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("company_name").trim().notEmpty().withMessage("Company name is required").escape(),
    body("company_email").trim().notEmpty().withMessage("Email is required").escape(),
    body("first_name").trim().notEmpty().withMessage("Last Name required").escape(),
    body("last_name").trim().notEmpty().withMessage("Last Name required").escape(),
    body("company_job_title").trim().notEmpty().withMessage("Job Title required").escape(),
    body("phone_number").trim().notEmpty().withMessage("Phone Number required").escape(),
    body("address").trim().notEmpty().withMessage("Address required").escape(),
    body("website").trim().notEmpty().withMessage("website required").escape(),
    body("company_reg_number").trim().notEmpty().withMessage("company_reg_number required").escape(),
    body("lat").trim().notEmpty().withMessage("latitude required").escape(),
    body("lng").trim().notEmpty().withMessage("urn required").escape(),
    // body("crn").notEmpty().withMessage("CRN is required"),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await addNewClient(req, res);
    })();
  }
);

module.exports = router;
