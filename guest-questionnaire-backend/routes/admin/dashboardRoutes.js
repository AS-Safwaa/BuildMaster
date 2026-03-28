const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Protect overview routes with Admin Auth
router.use(authMiddleware);

// Overview Metrics
router.get('/overview', dashboardController.getOverviewMetrics);

module.exports = router;
