const mongoose = require("mongoose");

const Recording = mongoose.model("Recording", {
  video: { type: Buffer },
  filename: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = Recording;
