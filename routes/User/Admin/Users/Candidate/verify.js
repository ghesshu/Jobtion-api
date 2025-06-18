const { Router } = require("express");
const verifyUser = require('../../../../../middlewares/admin-token');
const { verifyCandidate } = require("../../../../../controllers/Admin/userController"); // Assuming this controller function exists or will be created

const router = Router({ strict: true });

// Route to fetch a single candidate by ID
router.post("/", verifyUser, (req, res) => {
  (async () => {
    // Call the controller function to fetch the single candidate
    await verifyCandidate(req, res);
  })();
});

module.exports = router;