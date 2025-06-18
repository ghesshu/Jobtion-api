const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const path = require("path");
const welcome = require("./routes/welcome");
const health = require("./routes/health_check");
const deleteUser = require("./routes/delete_user");
const all_routes = require("./routes/index");
const multer = require("multer");

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//* Set CSP headers to allow authorized urls ****//
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "node.jobtiondevs.com"],
    },
  })
);

//****compress all request and response */
app.use(compression());

//******checking for unauthorized url hitting the routes */
app.use(
  cors({
    // origin: ["http://localhost:8000", "http://localhost:5174","http://localhost:5173","http://localhost:3000","https://uat.jobtiondevs.com","https://jobtion-web.vercel.app","https://jobtion-azuf9lgx7-nanamanuel007s-projects.vercel.app/"],
    origin: "*",
    // credentials: true,
  })
);

//******Default setting for expressJs */
app.use(express.json());
// app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));

//*****Welcome Page*/
app.use("/", welcome);
app.use("/health", health);
//*****Delete User */
app.use("/delete-user", deleteUser);

//****Routing all API routes */
all_routes.forEach((value, key) => {
  app.use("/api/jobtion" + key, value);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred (e.g., file size exceeded)
    res
      .status(400)
      .json({ success: false, message: err.message + " - " + err.field });
  } else {
    // An unknown error occurred
    res.status(500).json({ success: false, message: err.message });
  }
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  if (err.status === 503) {
    res.status(503).json({ error: "Service Unavailable" });
  } else {
    next(err);
  }
});

module.exports = app;
