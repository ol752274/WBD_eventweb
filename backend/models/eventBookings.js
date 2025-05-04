const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    eventType: String,
    startDate:{
     type:Date,
     required:true,
    },
    endDate: {
       type: Date,
       required:true,
    }, // Replacing startTime and endTime with endDate
    venue: String,
    city: String, // New field for city
    state: String, // New field for state
    numberOfAttendees: String,
   

    organizerDetails: {
        organizerName: String,
        contactNumber: String,
        email: String,
    },
    weddingDetails: {
        brideName: String,
        groomName: String,
        weddingTheme: String,
        cateringPreferences: String,
        price: Number,
    },
    birthdayDetails: {
        birthdayPersonName: String,
        age: Number,
        partyTheme: String,
        cakeSize: String,
        entertainmentOptions: String,
        price: Number,
    },
    socialEventDetails: {
        eventPurpose: String,
        sponsors: String,
        entertainment: String,
        price: Number,
    },
    corporateEventDetails: {
        companyName: String,
        agenda: String,
        equipmentRequired: String,
        price: Number,
    },
    totalPrice: Number,
    employeeEmail: {
        type: String,
        required: true,  // Assuming employeeEmail is required
        match: /.+\@.+\..+/  // Regex pattern to validate email format
    },
});

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;