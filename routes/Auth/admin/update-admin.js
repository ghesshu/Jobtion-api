const express = require('express');
const router = express.Router();
const { updateAdmin } = require('../../../controllers/Gen/authController'); // Adjust path as needed
const verifyUser  = require('../../../middlewares/admin-token'); // Assuming you have admin auth middleware

router.patch('/', verifyUser, /* validateUpdateAdmin, */ updateAdmin);

module.exports = router;