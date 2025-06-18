const { Router } = require("express");
const { getUserDetails } = require("../../../controllers/Gen/profileController.js");
const { verifyToken } = require("../../../utils/tokenHandler.js");
const executeQuery = require("../../../db/serverless_connection.js");
const Response = require("../../../utils/standardResponse.js");

const router = Router({ strict: true });

router.get("/", async (req, res, next) => {
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
router.get("/", (req, res, next) => {
  (async () => {
    await getUserDetails(req, res);
  })();
});

module.exports = router;
