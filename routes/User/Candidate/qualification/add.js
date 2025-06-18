const { Router } = require("express");
const { add } = require("../../../../controllers/Candidate/qualificationController.js");
const { body, validationResult } = require("express-validator");
const verifyUser = require("../../../../middlewares/token");
const { verifyToken } = require("../../../../utils/tokenHandler.js");
const { storage, fileFilter } = require("./upload_qualification.js");
// const { handleFormWithoutFile } = require("../../../utils/fileUpload.js");
const multer = require("multer");
const Response = require("../../../../utils/standardResponse.js");

const router = Router({ strict: true });

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/", verifyUser);

//***************validate fields */
router.post(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("qualification_type").trim().notEmpty().withMessage("Qualification type field is required"),
  ],
  (req, res, next) => {
    (async () => {
      //*****check user type first before hitting */
      res.locals.user_type === "Candidate"
        ? 
        //****hitting the controller */
        await add(req, res)
        : res
            .status(401)
            .json({
              success: false,
              message: "Can't access this route : User not a candidate",
            });
    })();
  }
);

module.exports = router;
