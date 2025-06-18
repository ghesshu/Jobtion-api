const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { storage, fileFilter } = require("../../../../../utils/upload_function/recuritementUpload");
const multer = require("multer");
const verifyUser = require("../../../../../middlewares/token");
const { fetchUserByEmailOrID } = require("../../../../../models/userModel");
const { updateNewClient } = require("../../../../../controllers/Admin/userController");

const router = Router({ strict: true });

router.patch("/", verifyUser);

const upload = multer({ storage: storage, fileFilter: fileFilter });

//***************validate fields */
router.patch(
  "/",
  upload.any(),
  (req, res, next) => {
    (async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      await updateNewClient(req, res);
    })();
  }
);

module.exports = router;
