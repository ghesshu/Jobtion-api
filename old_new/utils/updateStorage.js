const Joi = require("joi");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const Minio = require("minio");
const multerMinioStorage = require("multer-minio-storage"); // You'll need to install this package

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

// Bucket name for storing files
const bucketName = process.env.MINIO_BUCKET || "jobtion-uploads";

// Ensure bucket exists before using it
const ensureBucketExists = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket '${bucketName}' created successfully`);
    }
  } catch (err) {
    console.error(`Error ensuring bucket exists: ${err}`);
  }
};

// Call this function when the app starts
ensureBucketExists();

// Configure multer to use MinIO storage
const storage = multerMinioStorage({
  minioClient: minioClient,
  bucket: bucketName,
  key: function (req, file, cb) {
    console.log("...building file name");
    const fileExtension = file.originalname.split(".").pop(); // Extract file extension
    const customName = `${req.email}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${fileExtension}`;
    cb(null, customName);
  },
  metadata: function (req, file, cb) {
    cb(null, { email: req.email });
  },
  contentType: multerMinioStorage.AUTO_CONTENT_TYPE,
});

// this function determines if a file should be stored or not
function fileFilter(req, file, cb) {
  console.log("...filtering file requests");

  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    const fn = file.fieldname;
    cb(`${fn} : Only PDF files are allowed!`);
  }

  // validation using joi starts here
  const validSchema = Joi.object({
    preference: Joi.array(),
    job_types: Joi.array(),
    job_preferred: Joi.array(),
    dbs_on_server: Joi.bool(),
    dbs_expiry_date: Joi.string(),
    dbs_serial_number: Joi.string(),
    level_name: Joi.string(),
    citizen: Joi.bool(),
    right_to_work: Joi.bool(),
  });

  const { error } = validSchema.validate({ ...req.body }); // validate

  // if validation fails write error and don't save file
  if (error) {
    console.log("validation error", error.details[0].message);
    // don't store file if validation fails from multer docs
    cb(null, true);
  } else {
    // save file if no validation error, from multer docs
    cb(null, true);
  }
}

module.exports = {
  storage,
  fileFilter,
  minioClient, // Export the MinIO client for potential direct use elsewhere
  bucketName, // Export the bucket name for reference
};
//