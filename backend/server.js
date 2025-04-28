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

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const dashBoardRoutes = require('./routes/dashBoardRoutes');
const bookRoutes = require('./routes/bookRoutes');
const empdashRoutes = require('./routes/empDashRoutes');
const statRoutes = require('./routes/statRoutes');

// Static Uploads
app.use('/uploads', express.static('uploads'));

// CORS Config
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.raw());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventWeb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Logging Setup
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});

app.use(morgan('combined', { stream: accessLogStream }));

// Session
app.use(session({
  key: "userid",
  secret: process.env.SESSION_SECRET || "project",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24 * 1000,
    secure: false,
    httpOnly: true,
    sameSite: 'Lax',
  }
}));

// Routes
app.use('/', authRoutes);
app.use('/', dashBoardRoutes);
app.use('/', bookRoutes);
app.use('/', empdashRoutes);
app.use('/', statRoutes);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
