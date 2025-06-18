const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token.js');
const { getRoles } = require("../../../../controllers/Admin/roleController.js");


const router = Router({ strict: true });

router.get("/", verifyUser);

router.get(
  "/",
  (req, res) => {
    (async () => {
    //*****check user type first before hitting */
    res.locals.user_type === 'admin' || res.locals.user_type === 'Admin' ?
      //****hitting the controller */
      await getRoles(req, res)
      :
      res.status(401).json({"success":false, message:"Can't access this route : User not an admin"})
    })();
  }
);

module.exports = router;
