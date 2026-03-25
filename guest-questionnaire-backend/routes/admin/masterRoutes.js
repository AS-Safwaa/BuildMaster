const express = require('express');
const router = express.Router();
const masterController = require('../../controllers/admin/masterController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Protect all master routes with Admin Auth
router.use(authMiddleware);

// Master Types
router.get('/types', masterController.getAllMasterTypes);
router.post('/types', masterController.createMasterType);

// Master Values
router.get('/values', masterController.getMasterValues);
router.post('/values', masterController.createMasterValue);
router.put('/values/:id', masterController.updateMasterValue);
router.delete('/values/:id', masterController.deleteMasterValue);

module.exports = router;
