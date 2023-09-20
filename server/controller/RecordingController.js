const multer = require("multer");

const storage = multer.memoryStorage();


const Recording = require("../models/Recording");

const recordCon = async (req, res) => {
  try {
    const video = req.file;
    if (!video) {
      res.status(400).json({ error: "No video uploaded" });
    }

    const recording = new Recording({
      video: video.buffer,
      filename: video.originalname,
    });
    await recording.save();

    res.status(201).json({ message: "Recording saved successfully" });
  } catch (error) {
    console.error("Error saving recording:", error);
    res.status(500).json({ error: "Saving recording failed" });
  }
};

module.exports = {recordCon};
