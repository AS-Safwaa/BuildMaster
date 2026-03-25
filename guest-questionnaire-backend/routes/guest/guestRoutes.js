const express = require('express');
const router = express.Router();
const guestController = require('../../controllers/guest/guestController');

// Guest Form Render and Submit URLs
router.get('/form-definition', guestController.getFormDefinition);
router.post('/submissions', guestController.startSubmission);
router.put('/submissions/:session_id/answers', guestController.saveAnswers);
router.post('/submissions/:session_id/complete', guestController.completeSubmission);
router.post('/upload', guestController.uploadFile);

module.exports = router;
