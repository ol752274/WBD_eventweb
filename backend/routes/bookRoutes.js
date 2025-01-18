const express = require('express');
const Booking = require('../models/eventBookings');
const router = express.Router();
const Log = require('../models/Logs');
// Booking route
const Employee = require('../models/Employee'); // Ensure the Employee model is imported

// Debug route to check session data
router.get('/check-session', (req, res) => {
    console.log(req.session); // Logs session data to the console
    res.json(req.session);    // Sends session data as JSON to the frontend
});

router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Middleware to authenticate the user using session
const authenticateUser = (req, res, next) => {
    console.log('Session data:', req.session); // Log session data
    if (req.session && req.session.email) {
        req.user = {
            email: req.session.email,
            role: req.session.role || 'User',  // Default role if none is provided
        };
        return next();
    }
    res.status(401).send({ error: 'User not authenticated' });
};

// Booking route
const handleError = (res, message, status = 500) => {
    console.error(message);
    res.status(status).json({ error: message });
};


router.post('/book', authenticateUser, async (req, res) => {
  try {
      // Check if the user has the correct role
      if (req.user.role !== 'User') {
          return res.status(403).json({ error: 'Unauthorized: Only Users can book' });
      }

      // Extract required fields from the request body
      const { startDate, endDate, employeeEmail, organizerDetails } = req.body;

      // Check if the organizer's email matches the session email
      if (organizerDetails && organizerDetails.email !== req.user.email) {
          return res.status(400).json({ error: 'Unauthorized: Organizer email does not match session email' });
      }

      // Validate request body
      if (!startDate || !endDate || !employeeEmail) {
          return res.status(400).json({ error: 'Start date, end date, and employee email are required' });
      }

      // Convert the dates to Date objects
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      // Check for valid date range
      if (newStartDate >= newEndDate) {
          return res.status(400).json({ error: 'End date must be after the start date' });
      }

      // Find the selected employee
      const selectedEmployee = await Employee.findOne({ email: employeeEmail });
      if (!selectedEmployee) {
          return res.status(404).json({ error: 'Selected employee does not exist' });
      }

      // Check if the employee is available for the requested period
      const hasConflict = selectedEmployee.employmentPeriods.some(period => {
          const periodStartDate = new Date(period.startDate);
          const periodEndDate = new Date(period.endDate);

          // Check if the new booking overlaps with existing periods
          return (newStartDate < periodEndDate && newEndDate > periodStartDate);
      });

      if (hasConflict) {
          return res.status(400).json({ error: 'Selected employee is not available for the requested dates' });
      }

      // Check if a booking with the same details already exists
      const existingBooking = await Booking.findOne({
          userEmail: req.user.email,
          employeeEmail: employeeEmail,
          startDate,
          endDate,
          // Include other relevant fields from req.body if necessary
      });

      if (existingBooking) {
          return res.status(400).json({ error: 'A booking with the same details already exists' });
      }

      // Add the new start and end dates to the selected employee's employmentPeriods
      selectedEmployee.employmentPeriods.push({ startDate: newStartDate, endDate: newEndDate });

      // Save the updated employee with the new employment period
      await selectedEmployee.save();

      // Create a new booking with the provided employee's email
      const booking = new Booking({
          ...req.body,
          userEmail: req.user.email,
          employeeEmail: employeeEmail, // Use the selected employee's email
      });

      // Save the new booking
      await booking.save();

      res.status(201).json({ message: 'Booking saved successfully', booking });
  } catch (error) {
      console.error('Error saving booking:', error);
      res.status(500).json({ error: 'Error saving booking: ' + error.message });
  }
});



router.get('/bookings', async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




  router.delete('/bookings/:id', async (req, res) => {
    try {
      // Find the booking to be deleted
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).send('Booking not found');
      }
  
      // Get the employee's email and the booking's startDate and endDate
      const { employeeEmail, startDate, endDate } = booking;
  
      // Find the employee by email
      const employee = await Employee.findOne({ email: employeeEmail });
      if (!employee) {
        return res.status(404).send('Employee not found');
      }
  
      // Log employee and booking dates for debugging
      console.log('Employee:', employee);
      console.log('Booking Dates:', { startDate, endDate });
  
      // Log employment periods for debugging
      console.log('Employee Employment Periods:', employee.employmentPeriods);
  
      // Normalize dates for comparison (remove time)
      const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      };
  
      // Find the employment period by matching the startDate and endDate
      const matchedPeriod = employee.employmentPeriods.find(period => {
        return (
          normalizeDate(period.startDate).getTime() === normalizeDate(startDate).getTime() &&
          normalizeDate(period.endDate).getTime() === normalizeDate(endDate).getTime()
        );
      });
  
      // If no period matches, log it and return
      if (!matchedPeriod) {
        console.log('No matching employment period found');
        return res.status(404).send('No matching employment period found');
      }
  
      console.log('Matched Period:', matchedPeriod);
  
      // Remove the matched employment period using its _id
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employee._id,
        {
          $pull: {
            employmentPeriods: { _id: matchedPeriod._id }
          }
        },
        { new: true } // Return the updated employee document
      );
  
      console.log('Updated Employee:', updatedEmployee);
  
      // Delete the booking
      await Booking.findByIdAndDelete(req.params.id);


      const logEntry = new Log({
        eventType: booking.eventType,
        startDate: booking.startDate,
        endDate: booking.endDate,
        venue: booking.venue,
        city: booking.city,
        state: booking.state,
        numberOfAttendees: booking.numberOfAttendees,
        paymentMethod: booking.paymentMethod,
        organizerDetails: booking.organizerDetails,
        weddingDetails: booking.weddingDetails,
        birthdayDetails: booking.birthdayDetails,
        socialEventDetails: booking.socialEventDetails,
        corporateEventDetails: booking.corporateEventDetails,
        totalPrice: booking.totalPrice,
        employeeEmail: booking.employeeEmail,
        action: 'Booking Deleted',
        logTimestamp: Date.now()
      });
  
      await logEntry.save();
      res.status(200).send('Booking and associated employment period removed successfully');
    } catch (error) {
      res.status(500).send('Error deleting booking');
      console.error(error);
    }
  });
  
  router.get('/my-bookings', async (req, res) => {
    try {
      const employeeEmail = req.session.email;
      console.log('Session email received in /my-bookings:', req.session.email);

      
      if (!employeeEmail) {
        return res.status(400).json({ message: 'Employee email not found in session' });
      }
  
      // Fetch bookings for the logged-in employee
      const bookings = await Booking.find({ employeeEmail });
  
      if (bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this employee' });
      }
  
      // Send bookings to the frontend
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching employee bookings:', error);
      res.status(500).json({ message: 'Server error while fetching bookings' });
    }
  });

  router.get('/MeAsUserBookings', async (req, res) => {
    try {
        const userEmail = req.session.email;

        if (!userEmail) {
            return res.status(400).json({ message: 'User email not found in session' });
        }

        const bookings = await Booking.find({ 'organizerDetails.email': userEmail });
        console.log(bookings)

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for you' });
        }

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
});

  
router.get('/logs', async (req, res) => {
  try {
    const { sortBy, order, eventType } = req.query;

    // Build the query object
    let query = {};
    if (eventType) {
      query.eventType = { $regex: eventType, $options: 'i' }; // Case-insensitive search
    }
    

    // Fetch logs with optional sorting
    let logs = await Log.find(query);

    // Sort the logs
    if (sortBy) {
      logs.sort((a, b) => {
        if (sortBy === 'date') {
          return order === 'asc' 
            ? new Date(a.startDate) - new Date(b.startDate) 
            : new Date(b.startDate) - new Date(a.startDate);
        }
        if (sortBy === 'price') {
          return order === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
        }
        return 0; // Default case
      });
    }

    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Error fetching logs: ' + error.message });
  }
});
module.exports = router;