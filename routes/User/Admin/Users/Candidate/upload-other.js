const { Router } = require("express");
const multer = require('multer'); // Import multer
const verifyUser = require('../../../../../middlewares/admin-token');
// Import storage and fileFilter instead of a pre-configured upload instance
const { storage, fileFilter } = require("../../../../../utils/referenceUpload"); 
const { uploadCandidateOther } = require("../../../../../controllers/Admin/userController"); // Assuming this controller function exists or will be created

// Create the multer instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = Router({ strict: true });

// Route to upload a candidate document
router.post("/", verifyUser, upload.single('document_file'), (req, res) => {
  (async () => {
    // Call the controller function to fetch the single candidate
    await uploadCandidateOther(req, res);
  })();
});

module.exports = router;