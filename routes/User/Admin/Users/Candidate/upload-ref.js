// const express = require('express');
// const router = express.Router();
// const uploadCandidateDoc = require('../../../../controllers/Admin/userController');
// const { adminToken } = require('../../../../middlewares/admin-token'); // Assuming admin auth middleware
// const { upload } = require('../../../../utils/fileUpload'); // Assuming multer setup is in fileUpload.js

// // POST route for uploading a candidate document
// // Expects 'candidate_id', 'file_name' in body and 'document_file' as the file field
// router.post('/upload-doc', 
//     adminToken, // Protect the route
//     upload.single('document_file'), // Handle single file upload with field name 'document_file'
//     uploadCandidateDoc
// );

// module.exports = router;


const { Router } = require("express");
const multer = require('multer'); // Import multer
const verifyUser = require('../../../../../middlewares/admin-token');
// Import storage and fileFilter instead of a pre-configured upload instance
const { storage, fileFilter } = require("../../../../../utils/referenceUpload"); 
const { uploadCandidateReference } = require("../../../../../controllers/Admin/userController"); // Assuming this controller function exists or will be created

// Create the multer instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = Router({ strict: true });

// Route to upload a candidate document
router.post("/", verifyUser, upload.single('document_file'), (req, res) => {
  (async () => {
    // Call the controller function to fetch the single candidate
    await uploadCandidateReference(req, res);
  })();
});

module.exports = router;