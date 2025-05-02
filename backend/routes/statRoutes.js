const express = require('express');
const Booking = require('../models/eventBookings');
const router = express.Router();
// Booking route


router.get('/trailAdmin', async (req, res, next) => {
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
        next(error)
        
    }
});

router.use((err, req, res, next) => {
    logger.error({
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  });

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Routes for admin statistics and analytics
 */

/**
 * @swagger
 * /trailAdmin:
 *   get:
 *     summary: Get total income and booking count grouped by event type
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Income statistics by event type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   totalIncome:
 *                     type: number
 *                     example: 150000
 *                   bookingCount:
 *                     type: integer
 *                     example: 12
 *       500:
 *         description: Internal server error
 */
