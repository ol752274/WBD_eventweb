const mongoose = require('mongoose');

// Define the Booking schema
const BookingSchema = new mongoose.Schema({
    eventType: {
        type: String,
        index: true
    },
    startDate: {
        type: Date,
        required: true,
        index: true
    },
    endDate: {
        type: Date,
        required: true,
        index: true
    },
    venue: {
        type: String,
        index: true // Added index for venue-based filtering
    },
    city: {
        type: String,
        index: true
    },
    state: {
        type: String,
        index: true // Added index for state-level search
    },
    numberOfAttendees: {
        type: String,
        index: true // Useful for filtering by attendance range
    },
    paymentMethod: {
        type: String,
        index: true // If filtered by payment method (e.g., online/cash)
    },

    organizerDetails: {
        organizerName: {
            type: String,
            index: true // Name-based search
        },
        contactNumber: {
            type: String,
            index: true // For contact-based lookup
        },
        email: {
            type: String,
            index: true
        }
    },
    weddingDetails: {
        brideName: {
            type: String,
            index: true // Search by bride
        },
        groomName: {
            type: String,
            index: true // Search by groom
        },
        weddingTheme: String,
        cateringPreferences: String,
        price: {
            type: Number,
            index: true // For price filtering
        }
    },
    birthdayDetails: {
        birthdayPersonName: {
            type: String,
            index: true // Filter by name
        },
        age: Number,
        partyTheme: String,
        cakeSize: String,
        entertainmentOptions: String,
        price: {
            type: Number,
            index: true
        }
    },
    socialEventDetails: {
        eventPurpose: String,
        sponsors: String,
        entertainment: String,
        price: {
            type: Number,
            index: true
        }
    },
    corporateEventDetails: {
        companyName: {
            type: String,
            index: true // For filtering by company
        },
        agenda: String,
        equipmentRequired: String,
        price: {
            type: Number,
            index: true
        }
    },
    totalPrice: {
        type: Number,
        index: true // Commonly used in sorting or filtering
    },
    employeeEmail: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        index: true
    },
    logTimestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    action: {
        type: String,
        default: 'Booking Created',
        index: true // Useful for filtering different types of actions
    }
});

// Compound indexes for common queries
BookingSchema.index({ startDate: 1, city: 1 });
BookingSchema.index({ employeeEmail: 1, startDate: -1 });
BookingSchema.index({ eventType: 1, state: 1 });
BookingSchema.index({ "organizerDetails.organizerName": 1, startDate: -1 });

const Log = mongoose.model('Log', BookingSchema);

module.exports = Log;