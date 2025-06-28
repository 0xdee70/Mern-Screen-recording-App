const Recording = require("../models/Recording"); 
const User = require('../models/User');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/recordings');
fs.ensureDirSync(uploadsDir);

const recordCon = async (req, res) => {
  try {
    const webcamVideo = req.files["webcamVideo"][0];
    const screenVideo = req.files["screenVideo"][0];
    const userEmail = req.body.usermail;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate unique filenames
    const recordingId = uuidv4();
    const webcamFileName = `webcam_${recordingId}.webm`;
    const screenFileName = `screen_${recordingId}.webm`;
    
    const webcamPath = path.join(uploadsDir, webcamFileName);
    const screenPath = path.join(uploadsDir, screenFileName);

    // Save files to disk
    await fs.writeFile(webcamPath, webcamVideo.buffer);
    await fs.writeFile(screenPath, screenVideo.buffer);

    // Create recording record
    const newRecording = new Recording({
      userId: user._id,
      webcamVideoPath: webcamPath,
      screenVideoPath: screenPath,
      title: req.body.title || 'Untitled Recording'
    });

    await newRecording.save();

    res.status(201).json({ 
      message: "Recording created successfully",
      recordingId: newRecording._id
    });
  } catch (error) {
    console.error('Error saving recording:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserRecordings = async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recordings = await Recording.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select('_id title createdAt duration isProcessing editedVideoPath');

    res.status(200).json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    res.status(200).json(recording);
  } catch (error) {
    console.error('Error fetching recording:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const serveVideo = async (req, res) => {
  try {
    const { recordingId, type } = req.params;
    
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    let videoPath;
    if (type === 'webcam') {
      videoPath = recording.webcamVideoPath;
    } else if (type === 'screen') {
      videoPath = recording.screenVideoPath;
    } else if (type === 'edited') {
      videoPath = recording.editedVideoPath;
    } else {
      return res.status(400).json({ message: "Invalid video type" });
    }

    if (!videoPath || !await fs.pathExists(videoPath)) {
      return res.status(404).json({ message: "Video file not found" });
    }

    const stat = await fs.stat(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/webm',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/webm',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error serving video:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { recordCon, getUserRecordings, getRecording, serveVideo };