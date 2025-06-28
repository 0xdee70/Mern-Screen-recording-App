const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  webcamVideoPath: {
    type: String,
    required: true
  }, 
  screenVideoPath: {
    type: String,
    required: true
  },
  editedVideoPath: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'Untitled Recording'
  },
  duration: {
    type: Number,
    default: 0
  },
  isProcessing: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;