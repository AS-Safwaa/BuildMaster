const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/authController');

// POST /api/v1/admin/auth/login
router.post('/login', authController.login);

module.exports = router;
