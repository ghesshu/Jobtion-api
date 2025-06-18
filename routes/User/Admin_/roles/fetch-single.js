const { Router } = require("express");
const { fetchARole } = require("../../../../controllers/Admin/roleController.js");
const { body, validationResult } = require("express-validator");
const verifyUser = require("../../../../middlewares/token.js");


const router = Router({ strict: true });

router.post("/", verifyUser);

router.post(
  "/",
  [
    //** Validate and sanitize request body **/
    body("id").trim().notEmpty().withMessage("id field is required").escape(),
    //* Handle validation errors **/
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
  ],
  (req, res) => {
    (async () => {
    //*****check user type first before hitting */
    res.locals.user_type === 'admin' || res.locals.user_type === 'Admin' ?
      //****hitting the controller */
      await fetchARole(req, res)
      :
      res.status(401).json({"success":false, message:"Can't access this route : User not an admin"})
    })();
  }
);

module.exports = router;
