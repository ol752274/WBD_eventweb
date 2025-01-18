const mongoose = require('mongoose');

// Define the Booking schema
const BookingSchema = new mongoose.Schema({
    eventType: String,
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    venue: String,
    city: String,
    state: String,
    numberOfAttendees: String,
    paymentMethod: String,

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
        required: true,
        match: /.+\@.+\..+/
    },
    // Optionally add a field to store the log timestamp or action type
    logTimestamp: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        default: 'Booking Created'
    }
});

// Reuse the Booking schema to create the Log model
const Log = mongoose.model('Log', BookingSchema);

module.exports = Log;