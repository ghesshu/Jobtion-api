const { Router } = require("express");
const { fetch } = require("../../../../controllers/Candidate/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')

const router = Router({ strict: true });

// router.post("/", verifyUser);

router.post(
  "/",
  (req, res) => {
    (async () => {
      //*****check user type first before hitting */
    //   res.locals.user_type === "Candidate"
    //     ? 
        //****hitting the controller */
         await fetch(req, res)
        // : res
        //     .status(401)
        //     .json({
        //       success: false,
        //       message: "Can't access this route : User not a candidate",
        //     });
    })();
  }
);

module.exports = router;
