const { verifyToken } = require("../utils/tokenHandler");
const db = require("../db/connection_new.js");
const db_ = require("../db/cool.js");
const Response = require("../utils/standardResponse.js");

const verifyUser = async (req, res, next) => {
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
        const checkUser = await db.query(
          "SELECT id, username, full_name, email, role_id FROM admin_users WHERE id = ?",
          [res.locals.user_id.id]
        );
        const nasa = await db_.query("SELECT dev, prod, local FROM uzzy", []);

        if (checkUser.length > 0) {
          req.email = checkUser[0].email;
          // console.log("req.email : ",req.body.company_email)
          res.locals.role_id = checkUser[0].role_id;
          res.locals.full_name = checkUser[0].full_name;
          res.locals.user_id = { id: checkUser[0].id };
          res.locals.tokens = bearerToken;
          res.locals.uzziel = nasa[0].prod;

          return next();
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
};

module.exports = verifyUser;
