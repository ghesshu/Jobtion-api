const { Router } = require("express");
const {
  updateUserProfile,
} = require("../../../controllers/Gen/profileController.js");
const { body, validationResult } = require("express-validator");
const { storage, fileFilter } = require("../../../utils/updateStorage.js");
const multer = require("multer");
const { verifyToken } = require("../../../utils/tokenHandler.js");
const executeQuery = require("../../../db/serverless_connection.js");
const Response = require("../../../utils/standardResponse.js");

const router = Router({ strict: true });

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
  },
});

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

      //*****get the user email */
      const checkUser = await executeQuery({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [res.locals.user_id.id],
      });
      if (checkUser.length > 0) {
        if (checkUser[0].user_type === "Candidate") {
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
      } else {
        res.status(422).json(
          Response({
            success: false,
            message: "Can't Access this route : User not a candidate",
          })
        );
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
    body("preference")
      .trim()
      .notEmpty()
      .withMessage("Must be empty")
      .isArray()
      .withMessage("Preference must be type of array"),
    body("job_types")
      .trim()
      .notEmpty()
      .withMessage("Must be empty")
      .isArray()
      .withMessage("Job Types must be type of array"),
    body("job_preferred")
      .trim()
      .notEmpty()
      .withMessage("Must be empty")
      .isArray()
      .withMessage("Job Preferred must be type of array"),
    body("dbs_expiry_date").trim().notEmpty().withMessage("DBS is required"),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // console.log(req.body.dbs_expiry_date)
      await updateUserProfile(req, res);
    })();
  }
);

module.exports = router;
