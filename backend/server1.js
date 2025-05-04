const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
require('dotenv').config();

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const dashBoardRoutes = require('./routes/dashBoardRoutes');
const bookRoutes = require('./routes/bookRoutes');
const empdashRoutes = require('./routes/empDashRoutes');
const statRoutes = require('./routes/statRoutes');
const paymentRoutes = require('./routes/payment'); // adjust path as needed

app.use('/uploads', express.static('uploads')); // Serves static files

// Setup CORS
app.use(cors({
  origin: 'http://localhost:3000', // Change to your frontend URL
  credentials: true,
}));

// Built-in middleware for parsing request bodies
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.text()); // Parse text/plain data
app.use(express.raw()); // Parse raw request bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/EventWeb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Logging Setup
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // Rotate logs daily
  path: logDirectory,
  compress: 'gzip', // Compress old logs
});

app.use(morgan('combined', { stream: accessLogStream })); // HTTP request logging

// Session setup
app.use(session({
  key: "userid",
  secret: "project",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24 * 1000, // 1 day
    secure: false,  // Set to true for HTTPS in production
    httpOnly: true, // Prevent XSS attacks
    sameSite: 'Lax', // Helps mitigate CSRF attacks
  }
}));

// Mount the routes
app.use('/', authRoutes);
app.use('/', dashBoardRoutes);
app.use('/', bookRoutes);
app.use('/', empdashRoutes);
app.use('/', statRoutes);

app.use('/payment', paymentRoutes); // now /payment/create-order will wo

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
