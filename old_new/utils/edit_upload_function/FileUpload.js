const Joi = require('joi')

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function handleFormWithoutFile (req, res, next) {
  try {
    console.log('...handling file request')

    // second validation on actual request
    // first validation occurs in file filter function in storage config
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

    const { error } = validSchema.validate({ ...req.body })
    if (error) {
      console.log('validation error', error.details[0].message)
      next();
      // return res.status(400).json('invalid request')
    }
    else{
      // console.log(req.files)
      next();
    }
    // return res.status(200).json('uploaded')
  } catch (error) {
    console.log('health error', error)
    return res.status(417).json('something went wrong')
  }
}

module.exports = {
  handleFormWithoutFile
}
