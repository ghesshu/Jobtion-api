const Joi = require('joi')
const multer = require('multer')
const fs = require('fs-extra')
const path = require('path');

// multer disk storage configuration
const storage = multer.diskStorage({
  // this function determines the folder name
  destination: function (req, file, cb) {
    console.log('...building destination folder')
    console.log(req)
    // create directory for user using name in request body
    fs.ensureDir(`./storage/uploads/client/profile_picture`, err => {
      if (err) {
        console.log('create directory error', err)
        cb(null, null)
      } else {
        cb(null, `./storage/uploads/client/profile_picture`)
      }
    })
  },
  // this function determines the file name
  filename: function (req, file, cb) {
    console.log('...building file name')
    // cb(null, Date.now() + '-' + file.originalname)
    const fileExtension = file.originalname.split('.').pop(); // Extract file extension
    const customName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
    cb(null, customName);
  }
})

// this function determines if a file should be stored or not
function fileFilter (req, file, cb) {
  console.log('...filtering file requests')

  

  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);

  console.log(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    const fn = file.fieldname;
    cb(null, null);
    console.log("error")
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
    // cb(`${fn} : Only PDF files are allowed!`);
  }

  // attempt validation here
  // you can add your validation logic here
  // only downside is you have to validate twice.
  // once over here to determine if the file should be stored
  // and another in the router to send back your error message

  // validation using joi starts here
  const validSchema = Joi.object({
    company_email: Joi.string().required(),
    company_name: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(), // require name property as string
    address: Joi.string().required(),
    company_job_title: Joi.string().required(),
    phone_number: Joi.string().required(),
    company_reg_number: Joi.string().required(),
    lat: Joi.string().required(),
    lng: Joi.string().required(),
    postcode: Joi.string().required(),
  })

  const { error } = validSchema.validate({ ...req.body }) // validate

  // if validation fails write error and don't save file
  if (error) {
    console.log('validation error', error.details[0].message)

    // don't store file if validation fails from multer docs
    cb(null, false)
  } else {
    // save file if no validation error, from multer docs 
    cb(null, true)

    // console.log(req.file)
  }
}

module.exports = {
  storage,
  fileFilter
}
