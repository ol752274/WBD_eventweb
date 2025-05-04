const mongoose = require('mongoose');

const employeeRegistrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  phone: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,           // Binary image data
    contentType: String     // MIME type, e.g., 'image/png', 'image/jpeg'
  },
  employmentPeriods: [{
    startDate: {
      type: Date,
      required: true,
      default: null
    },
    endDate: {
      type: Date,
      required: true,
      default: null
    }
  }],
});

// Create the model
const empRegistrations = mongoose.model('empRegistrations', employeeRegistrationSchema);

module.exports = empRegistrations;
