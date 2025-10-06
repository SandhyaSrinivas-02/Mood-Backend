const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  moods: [
    {
      mood: Number,
      activity: String,
      note: String,
      date: { type: Date, default: Date.now }
    }
  ],
  lastLogin: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
