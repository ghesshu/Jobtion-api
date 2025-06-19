const Joi = require('joi')
const multer = require('multer')
const { Client } = require('minio')
const path = require('path');

// MinIO client configuration
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 443,
  useSSL: process.env.MINIO_USE_SSL === "true" || false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const bucketName = process.env.MINIO_BUCKET_NAME || "jobtion";

// Ensure bucket exists
minioClient.bucketExists(bucketName, (err, exists) => {
  if (err) {
    console.log("Error checking bucket:", err);
  } else if (!exists) {
    minioClient.makeBucket(bucketName, "us-east-1", (err) => {
      if (err) {
        console.log("Error creating bucket:", err);
      } else {
        console.log("Bucket created successfully");
      }
    });
  }
});

// Custom storage engine for MinIO
class MinIOStorage {
  constructor(opts) {
    this.getBucketName = opts.bucketName || (() => bucketName);
    this.getKey = opts.key || this._defaultKey;
  }

  _defaultKey(req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const customName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${fileExtension}`;
    cb(null, `${req.email}/${customName}`);
  }

  _handleFile(req, file, cb) {
    this.getKey(req, file, (err, key) => {
      if (err) return cb(err);

      const chunks = [];
      file.stream.on("data", (chunk) => chunks.push(chunk));
      file.stream.on("end", () => {
        const buffer = Buffer.concat(chunks);

        minioClient.putObject(
          bucketName,
          key,
          buffer,
          buffer.length,
          {
            "Content-Type": file.mimetype,
            "Original-Name": file.originalname,
          },
          (err, etag) => {
            if (err) {
              console.log("MinIO upload error:", err);
              return cb(err);
            }

            console.log("File uploaded successfully to MinIO");
            cb(null, {
              bucket: bucketName,
              key: key,
              size: buffer.length,
              etag: etag,
              // Maintain compatibility with existing code expectations
              filename: path.basename(key),
              path: key,
              destination: `minio://${bucketName}/${req.email}`,
            });
          }
        );
      });

      file.stream.on("error", cb);
    });
  }

  _removeFile(req, file, cb) {
    minioClient.removeObject(bucketName, file.key, cb);
  }
}

// multer storage configuration using custom MinIO storage
const storage = multer({
  storage: new MinIOStorage({
    bucketName: bucketName,
    key: function (req, file, cb) {
      console.log("...building file name");
      const fileExtension = file.originalname.split(".").pop();
      const customName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExtension}`;
      cb(null, `${req.email}/${customName}`);
    },
  }),
}).storage;

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
    title: Joi.string().required(),
    pronouns: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(), // require name property as string
    address: Joi.string().required(),
    dob: Joi.string().required(),
    gender: Joi.string().required(),
    about_me: Joi.string().required(),
    lat: Joi.string().required(),
    lng: Joi.string().required(),
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
