const mongoose = require('mongoose');

// Define the Employee schema (same as empRegistrations)
const employeeSchema = new mongoose.Schema({
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
  employmentPeriods: [
    {
      startDate: {
        type: Date,
        default: null, // Set to true if this field should be mandatory
      },
      endDate: {
        type: Date,
        default: null, // Set to true if this field should be mandatory
      },
    },
  ],
  rating: {
    type: Number,
    default: 0, // Initialize with 0
  },
  rateCount: {
    type: Number,
    default: 0, // Initialize with 0
  },
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
