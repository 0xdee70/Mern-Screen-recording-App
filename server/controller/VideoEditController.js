const Recording = require("../models/Recording");
const User = require('../models/User');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Ensure output directory exists
const outputDir = path.join(__dirname, '../uploads/edited');
fs.ensureDirSync(outputDir);

const editVideo = async (req, res) => {
  try {
    const { recordingId, operations } = req.body;
    
    // Validate input
    if (!recordingId || !operations) {
      return res.status(400).json({ message: "Recording ID and operations are required" });
    }

    // Find recording
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    // Mark as processing
    recording.isProcessing = true;
    await recording.save();

    // Generate output filename
    const outputFileName = `edited_${uuidv4()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
      // Process video based on operations
      await processVideo(recording, operations, outputPath);

      // Update recording with edited video path
      recording.editedVideoPath = outputPath;
      recording.isProcessing = false;
      recording.updatedAt = new Date();
      await recording.save();

      res.status(200).json({ 
        message: "Video edited successfully",
        editedVideoPath: `/recordings/${recordingId}/video/edited`
      });
    } catch (error) {
      // Reset processing status on error
      recording.isProcessing = false;
      await recording.save();
      throw error;
    }
  } catch (error) {
    console.error('Error editing video:', error);
    res.status(500).json({ message: "Video editing failed", error: error.message });
  }
};

const processVideo = (recording, operations, outputPath) => {
  return new Promise((resolve, reject) => {
    let command = ffmpeg();
    
    // Determine which video to use as primary source
    const primaryVideo = operations.useWebcam ? recording.webcamVideoPath : recording.screenVideoPath;
    command.input(primaryVideo);

    // Apply trim operation
    if (operations.trim && operations.trim.start !== undefined && operations.trim.end !== undefined) {
      command.seekInput(operations.trim.start);
      command.duration(operations.trim.end - operations.trim.start);
    }

    // Handle audio
    if (operations.removeAudio) {
      command.noAudio();
    }

    // Set output format and codec
    command
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .output(outputPath);

    // Handle progress and completion
    command
      .on('start', (commandLine) => {
        console.log('FFmpeg process started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', () => {
        console.log('Video processing completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      });

    command.run();
  });
};

const mergeVideos = async (req, res) => {
  try {
    const { recordingIds, title } = req.body;
    const userEmail = req.body.userEmail;

    if (!recordingIds || recordingIds.length < 2) {
      return res.status(400).json({ message: "At least 2 recordings are required for merging" });
    }

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all recordings
    const recordings = await Recording.find({ 
      _id: { $in: recordingIds },
      userId: user._id 
    });

    if (recordings.length !== recordingIds.length) {
      return res.status(404).json({ message: "Some recordings not found" });
    }

    // Generate output filename
    const outputFileName = `merged_${uuidv4()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
      await mergeVideoFiles(recordings, outputPath);

      // Create new recording entry for merged video
      const mergedRecording = new Recording({
        userId: user._id,
        webcamVideoPath: outputPath, // Store merged video as webcam path
        screenVideoPath: outputPath, // Same path for both
        title: title || 'Merged Recording',
        editedVideoPath: outputPath
      });

      await mergedRecording.save();

      res.status(200).json({ 
        message: "Videos merged successfully",
        recordingId: mergedRecording._id,
        videoPath: `/recordings/${mergedRecording._id}/video/edited`
      });
    } catch (error) {
      console.error('Error merging videos:', error);
      res.status(500).json({ message: "Video merging failed", error: error.message });
    }
  } catch (error) {
    console.error('Error in merge videos:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const mergeVideoFiles = (recordings, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // Add all video inputs
    recordings.forEach(recording => {
      const videoPath = recording.editedVideoPath || recording.screenVideoPath;
      command.input(videoPath);
    });

    // Create filter complex for concatenation
    const filterInputs = recordings.map((_, index) => `[${index}:v][${index}:a]`).join('');
    const concatFilter = `${filterInputs}concat=n=${recordings.length}:v=1:a=1[outv][outa]`;

    command
      .complexFilter(concatFilter)
      .map('[outv]')
      .map('[outa]')
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .output(outputPath)
      .on('start', (commandLine) => {
        console.log('FFmpeg merge process started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Merging: ' + progress.percent + '% done');
      })
      .on('end', () => {
        console.log('Video merging completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('FFmpeg merge error:', err);
        reject(err);
      });

    command.run();
  });
};

const getEditingStatus = async (req, res) => {
  try {
    const { recordingId } = req.params;
    
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    res.status(200).json({ 
      isProcessing: recording.isProcessing,
      hasEditedVideo: !!recording.editedVideoPath
    });
  } catch (error) {
    console.error('Error getting editing status:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { editVideo, mergeVideos, getEditingStatus };