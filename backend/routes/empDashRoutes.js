const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Route to get employee details based on session email
router.get('/getMyEmpProfileDetails', async (req, res, next) => {
  try {
    console.log('Session email:', req.session.email); // Debugging
    
    if (!req.session.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const employee = await Employee.findOne({ email: req.session.email });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    res.json({ success: true, employee });
  } catch (error) {
    next(error);
  }
});


router.post('/updateEmpProfile', async (req, res, next)=> {
  try {
    const { employeeId, firstName, lastName, email, phone, maritalStatus, dob, street, city, state, country, experience, skills, limit } = req.body;
    
    console.log('Update request received:', req.body); // Log the request body

    // Check if employeeId is present
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    }

    // Find the employee by ID and update the details
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId, 
      {
        firstName,
        lastName,
        email,
        phone,
        maritalStatus,
        dob,
        street,
        city,
        state,
        country,
        experience,
        skills
      },
      { new: true } // Returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, employee: updatedEmployee });
  } catch (error) {
    next(error);
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
