// Add at the top of server.js
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || 4;

const compression = require("compression");
const app = require("./app");

// Enable compression
app.use(compression());

// Set proper security headers
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  });
  next();
});

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  next();
});

// Add health check endpoint for Coolify
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

const port = process.env.PORT || "4000";
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
