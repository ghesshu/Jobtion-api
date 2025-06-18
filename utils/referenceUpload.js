const Joi = require('joi')
const multer = require('multer')
const path = require('path');

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// this function determines if a file should be stored or not
// This function determines if a file should be accepted based on its type
function fileFilter (req, file, cb) {
  console.log('...filtering file requests');

  // Define allowed file types (e.g., images)
  // Adjust this regex based on the file types you want to allow
  const filetypes = /doc|docx|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    console.log('File accepted:', file.originalname);
    cb(null, true); // Accept the file
  } else {
    console.log('File rejected:', file.originalname);
    // Reject the file - provide a more specific error message
    cb(new Error('Invalid file type. Only DOC, DOCX, and PDF images are allowed.'), false);
  }
  // Note: Joi validation has been removed from here.
  // It's better practice to handle request body validation in the route handler or dedicated middleware
  // before the file upload middleware runs.
}

module.exports = {
  storage,
  fileFilter
}
