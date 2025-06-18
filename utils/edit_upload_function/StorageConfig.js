const Joi = require('joi')
const multer = require('multer')
const fs = require('fs-extra')

// multer disk storage configuration
const storage = multer.diskStorage({
  // this function determines the folder name
  destination: function (req, file, cb) {
    console.log('...building destination folder')
    // create directory for user using name in request body
    fs.ensureDir(`./storage/uploads/${req.email}`, err => {
      if (err) {
        console.log('create directory error', err)
        cb(null, null)
      } else {
        cb(null, `./storage/uploads/${req.email}`)
      }
    })
  },
  // this function determines the file name
filename: function (req, file, cb) {
    console.log("...building file name");
    // cb(null, file.originalname);
    const fileExtension = file.originalname.split('.').pop(); // Extract file extension
    const customName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
    cb(null, customName);
  },
})

// this function determines if a file should be stored or not
function fileFilter (req, file, cb) {
  console.log('...filtering file requests')

  // attempt validation here
  // you can add your validation logic here
  // only downside is you have to validate twice.
  // once over here to determine if the file should be stored
  // and another in the router to send back your error message

  // validation using joi starts here
  const validSchema = Joi.object({
    title: Joi.string(),
    pronouns: Joi.string(),
    first_name: Joi.string(),
    last_name: Joi.string(), // require name property as string
    address: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string(),
    about_me: Joi.string(),
    lat: Joi.string(),
    lng: Joi.string(),
  })

  const { error } = validSchema.validate({ ...req.body }) // validate

  // if validation fails write error and don't save file
  if (error) {
    console.log('validation error', error.details[0].message)

    // don't store file if validation fails from multer docs
    cb(null, true)
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
