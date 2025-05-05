const mongoose = require('mongoose');
// Define the Employee schema
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
    type: String, // Store the image path or filename
    required: true, // This can be optional
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

// Indexing fields for optimization
employeeSchema.index({ email: 1 }); // Index by email for quick lookups
employeeSchema.index({ city: 1 });  // Index by city for faster city-based searches
employeeSchema.index({ state: 1 }); // Index by state for state-based searches
employeeSchema.index({ country: 1 }); // Index by country for faster location-based queries
employeeSchema.index({ experience: 1 }); // Index by experience for fast filtering
employeeSchema.index({ skills: 1 }); // Index by skills for quicker search by skills
employeeSchema.index({ rating: -1 }); // Index by rating (descending order) for efficient rating-based queries
employeeSchema.index({ rateCount: 1 }); // Index by rateCount for quick queries based on the count

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;