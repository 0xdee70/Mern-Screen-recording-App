const express = require('express');
const router = express.Router();
const VideoEditController = require('../controller/VideoEditController');
const { authenticateToken } = require('../middleware/auth');

// All video editing routes require authentication
router.post('/edit-video', authenticateToken, VideoEditController.editVideo);
router.post('/merge-videos', authenticateToken, VideoEditController.mergeVideos);
router.get('/edit-status/:recordingId', authenticateToken, VideoEditController.getEditingStatus);

module.exports = router;