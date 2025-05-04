const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Route to get employee details based on session email
router.get('/getMyEmpProfileDetails', async (req, res) => {
  try {
    console.log('Session email:', req.session.email);

    if (!req.session.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const employee = await Employee.findOne({ email: req.session.email });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    let imageBufferBase64 = null;
    let contentType = null;

    if (employee.image && employee.image.data) {
      imageBufferBase64 = employee.image.data.toString('base64');
      contentType = employee.image.contentType;
    }

    res.json({
      success: true,
      employee: {
        ...employee.toObject(),
        imageBuffer: imageBufferBase64,
        imageType: contentType,
      },
    });

  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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


/**
 * @swagger
 * tags:
 *   name: Employee Dashboard
 *   description: Routes for managing employee dashboard and profile
 */

/**
 * @swagger
 * /getMyEmpProfileDetails:
 *   get:
 *     summary: Get the profile of the currently logged-in employee
 *     tags: [Employee Dashboard]
 *     responses:
 *       200:
 *         description: Employee profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /updateEmpProfile:
 *   post:
 *     summary: Update the profile of the currently logged-in employee
 *     tags: [Employee Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *               dob:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               experience:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Employee profile updated successfully
 *       400:
 *         description: Employee ID is required
 *       404:
 *         description: Employee not found
 */
