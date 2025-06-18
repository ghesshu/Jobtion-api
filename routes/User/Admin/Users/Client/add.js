const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { storage, fileFilter } = require("../../../../../utils/adminStorageConfig.js");
const multer = require("multer");
const verifyUser = require("../../../../../middlewares/token.js");
const { fetchUserByEmailOrID } = require("../../../../../models/userModel.js");
const { verifyToken } = require("../../../../../utils/tokenHandler.js");
const { addNewClient } = require("../../../../../controllers/Admin/userController.js");
const db = require("../../../../../db/connection_new.js");
const Response = require("../../../../../utils/standardResponse.js");

const router = Router({ strict: true });

router.post("/", async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    // Split the header into an array to get the token part
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
      // Extract the token from the array
      const bearerToken = tokenParts[1];
      // Attach the token to the request object for further use
      // token = req.token = bearerToken;
      res.locals.user_id = verifyToken(res, bearerToken);

      if (!!res.locals.user_id) {
        //*****get the user email */
        const checkUser = await db.query("SELECT email,role_id FROM admin_users WHERE id = ?",[res.locals.user_id.id]);

        if (checkUser.length > 0) {
          req.email = checkUser[0].email;
            next();
          
        } else {
          res.status(422).json(
            Response({
              success: false,
              message: "No User Found",
            })
          );
        }
      }
    }
  } else {
    res.status(422).json(
      Response({
        success: false,
        message: "No Token Found",
      })
    );
  }
});

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
router.post(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("company_name").notEmpty().withMessage("Company name is required"),
    body("company_email").notEmpty().withMessage("Email is required"),
    body("first_name").notEmpty().withMessage("First Name required"),
    body("last_name").notEmpty().withMessage("Last Name required"),
    body("company_job_title").notEmpty().withMessage("Job Title required"),
    body("phone_number").notEmpty().withMessage("Phone Number required"),
    body("address").notEmpty().withMessage("Address required"),
    body("website").notEmpty().withMessage("website required"),
    body("company_reg_number").notEmpty().withMessage("company_reg_number required"),
    body("lat").notEmpty().withMessage("latitude required"),
    body("lng").notEmpty().withMessage("longitude required"),
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
