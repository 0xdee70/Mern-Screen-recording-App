const express = require('express');
const router = express.Router();
const RecordingController = require('../controller/RecordingController')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/recordings', upload.single('video'), RecordingController.recordCon
);

module.exports = router;
