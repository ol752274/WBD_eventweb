const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Role = require('../models/Roles');
const empRegistrations = require('../models/empRegistrations'); 
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let resetTokens = {}; // A simple way to store reset tokens

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the upload middleware
const upload = multer({ storage: storage });

// Your existing routes here...


router.post('/signup', async (req, res ,next ) => {
  const { name, email, phone, password, confirmPassword } = req.body; // Include phone in destructuring

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with phone number
    user = new User({
      name,
      email,
      phone,  // Add phone here
      password: hashedPassword,
    });

    await user.save();

    // Create role entry for the new user, including the hashed password
    const newRole = new Role({ email, role: 'User', password: hashedPassword });
    await newRole.save();

    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next ) => {
  const { email, password } = req.body;

  try {
    const roleEntry = await Role.findOne({ email });
    if (!roleEntry) {
      return res.status(404).send('Role not found');
    }

    const isMatch = await bcrypt.compare(password, roleEntry.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
 
    // Store role and email in session
    req.session.role = roleEntry.role;
    req.session.email = roleEntry.email;
    console.log('Session after login:', req.session); 

   // Determine dashboard URL based on role
    let dashboardUrl;
    switch (roleEntry.role) {
      case 'Admin':
        dashboardUrl = '/mainAdmin'; // Example admin dashboard route
        break;
      case 'User':
        dashboardUrl = '/mainUser'; // Example user dashboard route
        break;
      case 'Employee':
        dashboardUrl = '/mainEmployee'; // Example manager dashboard route
        break;
      default:
        dashboardUrl = '/login'; // Redirect to login if role is unrecognized
        break;
    }
    
    // Send success response with dashboard URL
    res.json({ success: true, role: roleEntry.role, redirectUrl: dashboardUrl });
   

  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  // Destroy the session and clear session data
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Failed to logout');
    }

    // Clear session cookie on client-side
    res.clearCookie('connect.sid');
    
    // Send response for successful logout
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// In your server route
router.get('/user/checksession', (req, res) => {
  
  if (req.session.role) {

    return res.status(200).json({ role: req.session.role});
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
});


router.post('/register', upload.single('image'), async (req, res, next )=> {
  const { firstName, lastName, maritalStatus, dob, email, phone, street, city, state, country, experience, skills, password } = req.body;

  try {
    // Check if email already exists
    const existingEmployee = await empRegistrations.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'You have already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employee
    const newEmployee = new empRegistrations({
      firstName,
      lastName,
      maritalStatus,
      dob,
      email,
      phone,
      street,
      city,
      state,
      country,
      experience,
      skills,
      password: hashedPassword,
      image: req.file.path // Store the image path in the database
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Your registration will be approved by us very soon' });
  } catch (error) {
    next(error);
  }
});
// Route to fetch bookings based on email


//Forgot and Reset Password

// Send Password Reset Link
router.post('/forgot-password',async (req, res, next )=> {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[token] = email;  // Store the email and token
    
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ol752274@gmail.com', // Replace with your email
        pass: 'achh vgjm mifh mmbn', // Replace with your email password
      },
    });

    // Send mail
    const mailOptions = {
      from: 'ol752274@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    next(error);
  }
});

// Reset Password
router.post('/reset-password',async (req, res, next )=> {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user_role = await Role.findOne({ email });
    if (!user_role) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const hashedroles = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user_role.password = hashedroles;
    await user.save();
    await user_role.save()
    res.json({ message: 'Password updated successfully!' });
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
 *   - name: Auth
 *     description: Authentication and user management routes
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User registration
 *     description: Register a new user with name, email, phone, and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user.
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *               phone:
 *                 type: string
 *                 description: Phone number of the user.
 *               password:
 *                 type: string
 *                 description: Password chosen by the user.
 *               confirmPassword:
 *                 type: string
 *                 description: Password confirmation field.
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or passwords don't match
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login a user based on email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful login.
 *                 role:
 *                   type: string
 *                   description: The role of the user (Admin, User, Employee).
 *                 redirectUrl:
 *                   type: string
 *                   description: The URL the user should be redirected to.
 *       404:
 *         description: Role not found
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: End the current user session and clear cookies.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful logout.
 *                 message:
 *                   type: string
 *                   description: Message confirming logout.
 *       500:
 *         description: Failed to logout
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Sends a password reset link to the user's email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting password reset.
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset the password for the user using the new password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user whose password is to be reset.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Employee registration
 *     description: Register a new employee with various personal details.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Employee's first name.
 *               lastName:
 *                 type: string
 *                 description: Employee's last name.
 *               maritalStatus:
 *                 type: string
 *                 description: Employee's marital status.
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Employee's date of birth.
 *               email:
 *                 type: string
 *                 description: Employee's email address.
 *               phone:
 *                 type: string
 *                 description: Employee's phone number.
 *               street:
 *                 type: string
 *                 description: Employee's street address.
 *               city:
 *                 type: string
 *                 description: Employee's city.
 *               state:
 *                 type: string
 *                 description: Employee's state.
 *               country:
 *                 type: string
 *                 description: Employee's country.
 *               experience:
 *                 type: string
 *                 description: Employee's work experience.
 *               skills:
 *                 type: string
 *                 description: Employee's skills.
 *               password:
 *                 type: string
 *                 description: Password chosen by the employee.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture of the employee.
 *     responses:
 *       201:
 *         description: Employee registered successfully
 *       400:
 *         description: Employee already exists
 */
