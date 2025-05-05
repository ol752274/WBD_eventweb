const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true // Index for name-based searches or sorting
  },
  phone: {
    type: Number,
    required: true,
    index: true // Index for lookups by phone number
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Unique index for email-based lookups
  },
  password: {
    type: String,
    required: true
  }
});

// Updated compound index to include email as well
UserSchema.index({ name: 1, phone: 1, email: 1 });

module.exports = mongoose.model('User', UserSchema);