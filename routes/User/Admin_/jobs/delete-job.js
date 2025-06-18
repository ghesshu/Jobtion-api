const { Router } = require("express");
const { deleteJob } = require("../../../../controllers/Admin/jobController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')


const router = Router({ strict: true });

router.delete("/", verifyUser);

router.delete(
  "/",
  (req, res) => {
    (async () => {
    //*****check user type first before hitting */
    res.locals.user_type === 'admin' || res.locals.user_type === 'Admin'?
      //****hitting the controller */
      await deleteJob(req, res)
      :
      res.status(401).json({"success":false, message:"Can't access this route : User not an admin"})
    })();
  }
);

module.exports = router;
