const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/authController');

// Login route
router.post('/login', authController.login);

// Profile
router.post('/profile', authController.updateProfile);
router.post('/update-password', authController.updatePassword);

module.exports = router;
