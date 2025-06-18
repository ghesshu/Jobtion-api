const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const multer = require("multer");
const morgan = require("morgan");



// Route imports
const welcome = require("./routes/welcome");
const health = require("./routes/health_check");
const deleteUser = require("./routes/delete_user");
const all_routes = require("./routes/index");

const app = express();

app.use(morgan("dev"));

// Security headers with CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "node.jobtiondevs.com"],
    },
  })
);

// Compression middleware
app.use(compression());

// CORS configuration - consider using environment variables
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174", 
  "http://localhost:8000",
  "https://uat.jobtiondevs.com",
  "https://jobtion-web.vercel.app",
  // Replace this auto-generated URL with your custom domain
  "https://jobtion-azuf9lgx7-nanamanuel007s-projects.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Body parsing middleware (Express built-in, no need for bodyParser package)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", welcome);
app.use("/health", health);
app.use("/delete-user", deleteUser);

// API routes
all_routes.forEach((value, key) => {
  app.use("/api/jobtion" + key, value);
});

// Consolidated error handling middleware
app.use((err, req, res, next) => {
  // Handle Multer errors (file upload errors)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      message: `${err.message} - ${err.field}` 
    });
  }
  
  // Handle 503 Service Unavailable
  if (err.status === 503) {
    return res.status(503).json({ 
      error: "Service Unavailable" 
    });
  }
  
  // Generic error handler
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});

module.exports = app;