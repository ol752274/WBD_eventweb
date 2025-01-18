const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Route to get employee details based on session email
router.get('/getMyEmpProfileDetails', async (req, res) => {
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
    console.error('Error fetching employee details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/updateEmpProfile', async (req, res) => {
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
    console.error('Error updating employee profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
