const express = require('express');
const router = express.Router();
const multer = require('multer');
const RecordingController = require('../controller/RecordingController');

// Use memory storage for multer since we'll handle file saving manually
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
}); 

router.post('/recordings', upload.fields([
  { name: 'webcamVideo', maxCount: 1 },
  { name: 'screenVideo', maxCount: 1 }
]), RecordingController.recordCon);

router.get('/recordings', RecordingController.getUserRecordings);
router.get('/recordings/:recordingId', RecordingController.getRecording);
router.get('/recordings/:recordingId/video/:type', RecordingController.serveVideo);

module.exports = router;