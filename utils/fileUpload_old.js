const multer = require('multer');

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    console.log(res.locals)
    // const fieldName = file.fieldName
    // console.log(req.body.email)
    cb(null, `uploads/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
