const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Role = require('../models/Roles');
const empRegistrations = require('../models/empRegistrations'); 
const Employee = require('../models/Employee');
const Booking = require('../models/eventBookings');
const redis = require('../services/redisClient'); 


router.get('/manageEmpRegistrations', async (req, res) => {
  try {
    const employees = await empRegistrations.find();

    const employeesWithImageBuffers = employees.map((employee) => {
      let imageBufferBase64 = null;
      let contentType = null;

      if (employee.image && employee.image.data) {
        imageBufferBase64 = employee.image.data.toString('base64');
        contentType = employee.image.contentType;
      }

      return {
        ...employee.toObject(),
        imageBuffer: imageBufferBase64,
        imageType: contentType,
      };
    });

    res.status(200).json(employeesWithImageBuffers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});
  


  // Approve an employee


router.post('/approveEmployee/:id', async (req, res, next) => {
  try {
    // Fetch the employee to approve
    const employee = await empRegistrations.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if an employee with the same email already exists
    const existingEmployee = await Employee.findOne({ email: employee.email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'An employee with this email already exists' });
    }

    // Create new Employee document
    const newEmployee = new Employee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      maritalStatus: employee.maritalStatus,
      dob: employee.dob,
      email: employee.email,
      phone: employee.phone,
      street: employee.street,
      city: employee.city,
      state: employee.state,
      country: employee.country,
      experience: employee.experience,
      skills: employee.skills,
      password: employee.password, // Ensure hashed password is saved
      image: employee.image, // Assuming image is part of the employee data
    });

    // Save new Employee
    await newEmployee.save();

    // Create role entry for the new Employee
    const newRole = new Role({
      email: employee.email,
      role: 'Employee',
      password: employee.password, // Ensure the role's password is hashed as well
    });
    await newRole.save();

    // Optionally remove the employee from empRegistrations after approval
    await empRegistrations.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Employee approved successfully' });
  } catch (error) {
    next(error);
  }
});



router.get('/manageEmployees', async (req, res) => {
  try {
    const employees = await Employee.find();

    const employeesWithImageBuffers = employees.map((employee) => {
      let imageBufferBase64 = null;
      let contentType = null;

      if (employee.image && employee.image.data) {
        imageBufferBase64 = employee.image.data.toString('base64');
        contentType = employee.image.contentType;
      }

      return {
        ...employee.toObject(),
        imageBuffer: imageBufferBase64,
        imageType: contentType,
      };
    });

    res.status(200).json(employeesWithImageBuffers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});


  router.delete('/deleteEmployee/:id', async (req, res, next) => {
    try {
        // Find the employee by ID
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete the employee from the Employee collection
        await Employee.findByIdAndDelete(req.params.id);

        // Also delete the corresponding role entry from the Role collection
        await Role.findOneAndDelete({ email: employee.email }); // Adjust based on how you reference roles

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      next(error);
    }
});

router.delete('/deleteEmpRegistrations/:id', async (req, res, next) => {
  try {
      // Find the employee by ID
      const employee = await empRegistrations.findById(req.params.id);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      // Delete the employee from the Employee collection
      await empRegistrations.findByIdAndDelete(req.params.id);

      // Also delete the corresponding role entry from the Role collection
      await Role.findOneAndDelete({ email: employee.email }); // Adjust based on how you reference roles

      res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
});



router.get('/manageUsers', async (req, res, next) => {
  try {
    const cacheKey = 'manageUsersData';
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('✅ Serving users from Redis cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Step 2: Fetch from MongoDB
    const users = await User.find(); // Fetch users
    const roles = await Role.find(); // Fetch roles

    // Map roles to user emails
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.email] = role.role;
    });

    // Combine users with roles
    const usersWithRoles = users.map(user => ({
      ...user.toObject(),
      role: roleMap[user.email] || 'No Role'
    }));

    if (usersWithRoles.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Step 3: Cache the data in Redis (TTL: 10 minutes)
    await redis.set(cacheKey, JSON.stringify(usersWithRoles), 'EX', 600);
    console.log('📦 Data cached in Redis for 10 minutes');

    res.status(200).json(usersWithRoles);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update a user by ID


// Delete a user by ID
router.delete('/deleteUsers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id); // Delete user

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, delete the associated role as well
    await Role.findOneAndDelete({ email: deletedUser.email });

    res.status(204).send(); // No content to send back
  } catch (err) {
    next(err);
  }
});

router.get('/getAdminName', async (req, res, next) => {
  try {
    if (!req.session || !req.session.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    // Find the user in the Roles collection based on the email stored in the session
    const roleEntry = await Role.findOne({ email: req.session.email });

    if (!roleEntry || roleEntry.role !== 'Admin') {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Return the admin name to the client
    res.json({ success: true, adminName: roleEntry.email });
  } catch (error) {
    next(error);
  }
});



// ======================= User Management Routes ======================= //

router.get('/getMyUserProfileDetails', async (req, res, next) => {
  try {
    console.log('Session email:', req.session.email); // Debugging
    
    // Check if the session has the user's email
    if (!req.session.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Find the user by email stored in the session
    const user = await User.findOne({ email: req.session.email });
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user details including user ID (_id)
    res.json({
      success: true,
      user: {
        userId: user._id,   // Include user ID
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
});


router.post('/updateMyUserProfile', async (req, res, next) => {
  try {
    // Check if the session has the user's email
    if (!req.session.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, email, phone, password } = req.body;
    
    console.log('Update request received:', req.body); // Log the request body

    // Find the user by email from the session
    const user = await User.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user profile details
    if (name) user.name = name;
    // if (email) user.email = email;
    if (phone) user.phone = phone;


    // Save the updated user details
    const updatedUser = await user.save();

    // Return the updated user details
    res.json({ success: true, user: updatedUser });
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
 *   name: Dashboard
 *   description: Admin dashboard management routes
 */

/**
 * @swagger
 * /manageEmpRegistrations:
 *   get:
 *     summary: Get all employee registration requests
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of employee registrations
 */

/**
 * @swagger
 * /approveEmployee/{id}:
 *   post:
 *     summary: Approve and register a pending employee
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Registration ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee approved successfully
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /manageEmployees:
 *   get:
 *     summary: Get all approved employees
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of approved employees
 */

/**
 * @swagger
 * /deleteEmployee/{id}:
 *   delete:
 *     summary: Delete an approved employee
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /deleteEmpRegistrations/{id}:
 *   delete:
 *     summary: Delete an unapproved employee registration
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Registration ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee registration deleted successfully
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /manageUsers:
 *   get:
 *     summary: Get all registered users with their roles
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of users with roles
 */

/**
 * @swagger
 * /deleteUsers/{id}:
 *   delete:
 *     summary: Delete a user by ID and their associated role
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /getAdminName:
 *   get:
 *     summary: Get currently logged-in admin's email
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Admin name retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Admin not found
 */

/**
 * @swagger
 * /getMyUserProfileDetails:
 *   get:
 *     summary: Get current user profile from session
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /updateMyUserProfile:
 *   post:
 *     summary: Update profile of the currently logged-in user
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
