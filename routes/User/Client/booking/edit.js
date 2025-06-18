const { Router } = require("express");
const { edit } = require("../../../../controllers/Client/bookController");
const { body, validationResult } = require("express-validator");
const verifyUser = require('../../../../middlewares/token')


const router = Router({ strict: true });

router.patch("/", verifyUser);

router.patch(
  "/",
  [
    //** Validate and sanitize request body **/
    body("candidate").trim().notEmpty().withMessage("candidate field is required").escape(),
    body("job").trim().notEmpty().withMessage("job field is required").escape(),
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
    res.locals.user_type === 'Client' ?
      //****hitting the controller */
      await edit(req, res)
      :
      res.status(401).json({"success":false, message:"Can't access this route : User not a client"})
    })();
  }
);

module.exports = router;
