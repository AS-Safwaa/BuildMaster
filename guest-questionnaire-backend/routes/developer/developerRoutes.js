const express = require('express');
const router = express.Router();
const developerController = require('../../controllers/developer/developerController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard/overview', developerController.getOverviewMetrics);
router.get('/projects/pool', developerController.getPoolProjects);
router.get('/projects/mine', developerController.getMyProjects);
router.post('/projects/:id/claim', developerController.claimProject);
router.post('/projects/:id/status', developerController.updateStatus);

module.exports = router;
