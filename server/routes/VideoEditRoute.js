const express = require('express');
const router = express.Router();
const VideoEditController = require('../controller/VideoEditController');

router.post('/edit-video', VideoEditController.editVideo);
router.post('/merge-videos', VideoEditController.mergeVideos);
router.get('/edit-status/:recordingId', VideoEditController.getEditingStatus);

module.exports = router;