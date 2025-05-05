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
        match: /.+\@.+\..+/,
    },
});

// Indexing fields for optimization
BookingSchema.index({ startDate: 1 });  // Index by start date for quicker date range queries
BookingSchema.index({ endDate: 1 });    // Index by end date for date range filtering
BookingSchema.index({ eventType: 1 });   // Index by event type for faster searches
BookingSchema.index({ employeeEmail: 1 });  // Index by employee email for fast lookups by employee
BookingSchema.index({ venue: 1 });       // Index by venue if frequently queried
BookingSchema.index({ city: 1 });        // Index by city for city-specific searches
BookingSchema.index({ state: 1 });       // Index by state for state-specific searches
BookingSchema.index({ totalPrice: 1 });  // Index by total price for filtering or sorting bookings by price

// Create the Booking model
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;