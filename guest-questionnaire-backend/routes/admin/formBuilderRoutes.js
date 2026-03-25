const express = require('express');
const router = express.Router();
const formBuilderController = require('../../controllers/admin/formBuilderController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

// Form Steps
router.get('/steps', formBuilderController.getFormSteps);
router.post('/steps', formBuilderController.createFormStep);
router.put('/steps/:id', formBuilderController.updateFormStep);
router.delete('/steps/:id', formBuilderController.deleteFormStep);

// Form Questions
router.get('/questions', formBuilderController.getFormQuestions);
router.post('/questions', formBuilderController.createFormQuestion);
router.put('/questions/:id', formBuilderController.updateFormQuestion);
router.delete('/questions/:id', formBuilderController.deleteFormQuestion);

// Form Question Static Options
router.post('/questions/:question_id/options', formBuilderController.createQuestionOption);
router.delete('/questions/:question_id/options/:option_id', formBuilderController.deleteQuestionOption);

module.exports = router;
