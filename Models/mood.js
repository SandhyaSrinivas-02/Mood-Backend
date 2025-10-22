const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotions: [{
    emotion: {
      type: String,
      required: true
    },
    intensity: {
      type: Number,
      required: true
    },
    stages: [{
      type: String
    }],
    color: String
  }],
  reflection: {
    type: String
  },
  activities: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mood', moodSchema);