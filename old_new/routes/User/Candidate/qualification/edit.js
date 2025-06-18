const { Router } = require("express");
const { edit } = require("../../../../controllers/Candidate/qualificationController.js");
const { body, validationResult } = require("express-validator");
// const verifyUser = require("../../../../middlewares/token");
const { verifyToken } = require("../../../../utils/tokenHandler.js");
const { storage, fileFilter } = require("./edit_upload_quali.js");
// const { handleFormWithoutFile } = require("../../../utils/fileUpload.js");
const multer = require("multer");
const executeQuery = require("../../../../db/serverless_connection.js");
const Response = require("../../../../utils/standardResponse.js");

const router = Router({ strict: true });

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.patch("/", async (req, res, next) => {
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
          query: `SELECT * FROM users WHERE id = ?`,
          values: [res.locals.user_id.id],
        });

        if (checkUser.length > 0) {
          req.email = checkUser[0].email;

          if (checkUser[0].user_type === "Candidate") {
            next();
          } else {
            res.status(401).json(
                Response({
                  success: false,
                  message: "Can't access this route : User not a Candidate",
                })
              );
          }
          
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
router.patch(
  "/",
  upload.any(),
  [
    //** Validate and sanitize request body **/
    body("id").trim().notEmpty().withMessage("Id field is required"),
    body("qualification_type").trim().notEmpty().withMessage("Qualification type field is required"),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await edit(req, res);
    })();
  }
);

module.exports = router;
