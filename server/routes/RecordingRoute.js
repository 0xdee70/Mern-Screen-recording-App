const express = require('express');
const router = express.Router();
const multer = require('multer');
const RecordingController = require('../controller/RecordingController');
const { authenticateToken } = require('../middleware/auth');

// Use memory storage for multer since we'll handle file saving manually
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
}); 

// All recording routes require authentication
router.post('/recordings', authenticateToken, upload.fields([
  { name: 'webcamVideo', maxCount: 1 },
  { name: 'screenVideo', maxCount: 1 }
]), RecordingController.recordCon);

router.get('/recordings', authenticateToken, RecordingController.getUserRecordings);
router.get('/recordings/:recordingId', authenticateToken, RecordingController.getRecording);
router.get('/recordings/:recordingId/video/:type', authenticateToken, RecordingController.serveVideo);

module.exports = router;