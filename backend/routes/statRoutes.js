const express = require('express');
const Booking = require('../models/eventBookings');
const router = express.Router();
// Booking route


router.get('/trailAdmin', async (req, res) => {
    try {
        const bookings = await Booking.find({});

        // Calculate income based on event type
        const incomeByEventType = {};

        bookings.forEach(booking => {
            const { eventType, totalPrice } = booking;

            if (!incomeByEventType[eventType]) {
                incomeByEventType[eventType] = {
                    totalIncome: 0,
                    bookingCount: 0,
                };
            }

            incomeByEventType[eventType].totalIncome += totalPrice || 0; // Ensure totalPrice is a number
            incomeByEventType[eventType].bookingCount += 1;
        });

        res.json(incomeByEventType);
    } catch (error) {
        console.error('Error fetching event incomes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;