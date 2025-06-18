const { Router } = require("express");
const { editUserDetails } = require("../../../controllers/Gen/profileController.js");
const { body, validationResult } = require("express-validator");
// const upload = require("../../utils/fileUpload");
const { storage, fileFilter } = require("../../../utils/edit_upload_function/StorageConfig.js");
const { handleFormWithoutFile } = require("../../../utils/edit_upload_function/FileUpload.js");
const multer = require("multer");
const { verifyToken } = require("../../../utils/tokenHandler.js");
const executeQuery = require("../../../db/serverless_connection.js");
const recruitmentProfile = require("../Client/recruitmentProfile.js");
const Response = require("../../../utils/standardResponse.js");

const router = Router({ strict: true });

const upload = multer({ storage: storage, fileFilter: fileFilter });

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
        const checkUser = await executeQuery({
          query: `SELECT email,user_type FROM users WHERE id = ?`,
          values: [res.locals.user_id.id],
        });

        if (checkUser.length > 0) {
          req.email = checkUser[0].email;

          if (checkUser[0].user_type === "Client") {
            res.locals.user_type = checkUser[0].user_type;

            recruitmentProfile(req, res);
          } else {
            next();
          }
          // next();
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

//***************validate fields */
router.post(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("pronouns").trim().notEmpty().withMessage("Title is required").escape(),
    body("title").trim().notEmpty().withMessage("Title is required").escape(),
    body("last_name").trim().notEmpty().withMessage("Last Name required").escape(),
    body("address").trim().notEmpty().withMessage("Address required").escape(),
    body("dob").notEmpty().withMessage("Date of birth required"),
    body("gender").trim().notEmpty().withMessage("Gender required").escape(),
    body("about_me").notEmpty().withMessage("About Me required").escape(),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await editUserDetails(req, res);
    })();
  }
);

module.exports = router;
