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
    data: Buffer,        // The binary data of the image
    contentType: String  // The MIME type of the image
  }
  ,
  employmentPeriods: [{ // Array to store multiple start and end dates
    startDate: {
      type: Date,
      required: true,
      default: null // Set to true if this field should be mandatory
    },
    endDate: {
      type: Date,
      required: true,
      default: null // Set to true if this field should be mandatory
    }
  }],
});


employeeRegistrationSchema.index({ email: 1 }); // Index by email for quick lookups
employeeRegistrationSchema.index({ city: 1 });  // Index by city for faster city-based searches
employeeRegistrationSchema.index({ state: 1 }); // Index by state for state-based searches
employeeRegistrationSchema.index({ country: 1 }); // Index by country for faster location-based queries
employeeRegistrationSchema.index({ experience: 1 }); // Index by experience for fast filtering
employeeRegistrationSchema.index({ skills: 1 }); // Index by skills for quicker search by skills

// Create the model
const empRegistrations = mongoose.model('empRegistrations', employeeRegistrationSchema);

module.exports = empRegistrations;