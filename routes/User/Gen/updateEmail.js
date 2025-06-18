const { Router } = require("express");
const {updateUserEmail} = require("../../../controllers/Gen/profileController.js");
const { body, validationResult } = require("express-validator");
const { storage, fileFilter } = require("../../../utils/updateStorage.js");
const multer = require("multer");
const { verifyToken } = require("../../../utils/tokenHandler.js");
const db = require("../../../db/connection_new.js");
const Response = require("../../../utils/standardResponse.js");

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
      if (verifyToken(res, bearerToken) !== undefined) {
        res.locals.user_id = verifyToken(res, bearerToken);

      //*****get the user email */
      const checkUser = await db.query("SELECT email,user_type FROM users WHERE id = ?",[res.locals.user_id.id]);
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
      else{
        console.log("Token Not Found");
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
  [
    //** Validate and sanitize request body **/
    body("email").trim().notEmpty().withMessage("Email is required"),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // console.log(req.body.dbs_expiry_date)
      await updateUserEmail(req, res);
    })();
  }
);

module.exports = router;
