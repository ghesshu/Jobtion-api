const Joi = require("joi");
const multer = require("multer");
const { Client } = require("minio");
const path = require("path");

// MinIO client configuration
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Use existing bucket from environment
const bucketName = process.env.MINIO_BUCKET_NAME || "jobtion";

// Custom MinIO storage for Multer
class MinIOStorage {
  constructor() {
    this.bucketName = bucketName;
  }

  _handleFile(req, file, cb) {
    console.log("...building destination folder");
    console.log(req);

    // Generate filename with same logic as original
    const fileExtension = file.originalname.split(".").pop();
    const customName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${fileExtension}`;

    // Maintain exact same file organization: storage/uploads/client/profile_picture/
    const objectKey = `storage/uploads/client/profile_picture/${customName}`;

    console.log("...building file name");

    // Upload to MinIO
    minioClient.putObject(
      this.bucketName,
      objectKey,
      file.stream,
      (err, etag) => {
        if (err) {
          console.log("MinIO upload error:", err);
          return cb(err);
        }

        // Return file info in same format as disk storage
        cb(null, {
          destination: `storage/uploads/client/profile_picture`,
          filename: customName,
          path: objectKey,
          size: file.size,
        });
      }
    );
  }

  _removeFile(req, file, cb) {
    // Remove file from MinIO if needed
    minioClient.removeObject(this.bucketName, file.path, cb);
  }
}

// multer MinIO storage configuration
const storage = new MinIOStorage();

// this function determines if a file should be stored or not
function fileFilter(req, file, cb) {
  console.log("...filtering file requests");

  // Changed to filter for image files (JPEG, PNG, GIF)
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);

  console.log(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    const fn = file.fieldname;
    cb(null, null);
    console.log("error");
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and GIF images are allowed."
      )
    );
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
  });

  const { error } = validSchema.validate({ ...req.body }); // validate

  // if validation fails write error and don't save file
  if (error) {
    console.log("validation error", error.details[0].message);

    // don't store file if validation fails from multer docs
    cb(null, false);
  } else {
    // save file if no validation error, from multer docs
    cb(null, true);

    // console.log(req.file)
  }
}

module.exports = {
  storage,
  fileFilter,
};
