const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../../../../utils/tokenHandler.js");
const { updateRole } = require("../../../../controllers/Admin/roleController.js");
const db = require("../../../../db/connection_new.js");
const Response = require("../../../../utils/standardResponse.js");

const router = Router({ strict: true });

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
        const checkUser = await db.query("SELECT email,user_type FROM users WHERE id = ?",[res.locals.user_id.id]);

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

//***************validate fields */
router.patch(
  "/",
  [
    //** Validate and sanitize request body **/
    body("role_name").trim().notEmpty().withMessage("Role Name required").escape(),
    body("id").trim().notEmpty().withMessage("id field is required").escape(),
  ],
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await updateRole(req, res);
    })();
  }
);

module.exports = router;
