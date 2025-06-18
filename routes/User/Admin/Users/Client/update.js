const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { storage, fileFilter } = require("../../../../../utils/adminStorageConfig.js");
const verifyUser = require("../../../../../middlewares/admin-token");
const { fetchUserByEmailOrID } = require("../../../../../models/userModel");
const { updateNewClient } = require("../../../../../controllers/Admin/userController.js");

const router = Router({ strict: true });

router.patch("/", verifyUser);

//* Define the allowed image types
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

//* Define the maximum file size in bytes (e.g., 80KB)
const maxSize = 80 * 1024; // 80KB

const upload = multer({
  storage: storage,
  // limits: { fileSize: maxSize }, // Set the maximum file size
  fileFilter: (req, file, callback) => {
    const fn = file.originalname;
    const sz = file.size;

    if (!allowedImageTypes.includes(file.mimetype)) {

      return callback(new Error(`Invalid file type for - (${fn}). Only JPEG, PNG, and JPG images are allowed.`));
    }
    // Check if file size is within the limit
    // if (file.size > maxSize) {

    //   return callback(new Error(`File size exceeds the limit for - (${fn} with size ${sz}). Maximum size allowed is 80KB.`));
    // }
    // If both type and size are valid, accept the file
    callback(null, true);
  },
});

//***************validate fields */
router.patch(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("id").trim().notEmpty().withMessage("Client ID is required").escape(),
    // body("company_name").trim().notEmpty().withMessage("Company name is required").escape(),
    // body("company_email").trim().notEmpty().withMessage("Email is required").escape(),
    // body("first_name").trim().notEmpty().withMessage("First Name required").escape(),
    // body("last_name").trim().notEmpty().withMessage("Last Name required").escape(),
    // body("company_job_title").trim().notEmpty().withMessage("Job Title required").escape(),
    // body("phone_number").trim().notEmpty().withMessage("Phone Number required").escape(),
    // body("address").trim().notEmpty().withMessage("Address required").escape(),
    // body("website").trim().notEmpty().withMessage("website required").escape(),
    // body("company_reg_number").trim().notEmpty().withMessage("company_reg_number required").escape(),
    // body("lat").trim().notEmpty().withMessage("latitude required").escape(),
    // body("lng").trim().notEmpty().withMessage("longitude required").escape(),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await updateNewClient(req, res);
    })();
  }
);

module.exports = router;
