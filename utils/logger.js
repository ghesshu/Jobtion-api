const winston = require("winston");
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

const logger = (filename) => winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        message,
        timestamp,
        data, // metadata
      };

      return JSON.stringify(response);
    })
  ),
  // store logs in the console
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `logs/${filename}.log` }),
  ],
});


// const logger = winston.createLogger({
//     // Log only if level is less than (meaning more severe) or equal to this
//     level: "info",
//     // Use timestamp and printf to create a standard log format
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.printf(
//         (info) => `${info.timestamp} ${info.level}: ${info.message}`
//       )
//     ),
//     // Log to the console and a file
//     transports: [
//       new winston.transports.Console(),
//       new winston.transports.File({ filename: "logs/app.log" }),
//     ],
//   });

module.exports = logger;
