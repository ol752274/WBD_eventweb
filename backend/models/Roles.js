const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // explicitly indexed for faster lookups
  },
  role: { 
    type: String, 
    required: true, 
    index: true // index to optimize queries filtering by role
  },
  password: { 
    type: String, 
    required: true 
  }
});

roleSchema.index({ email: 1, role: 1 });

module.exports = mongoose.model('Roles', roleSchema);