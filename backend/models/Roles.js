const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  role: { type: String, required: true },
  password: { type: String, required: true }, // Add password field
});

module.exports = mongoose.model('Roles', roleSchema);
