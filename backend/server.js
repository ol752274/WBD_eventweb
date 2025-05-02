// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Route handlers
const authRoutes     = require('./routes/authRoutes');
const dashBoardRoutes= require('./routes/dashBoardRoutes');
const bookRoutes     = require('./routes/bookRoutes');
const empdashRoutes  = require('./routes/empDashRoutes');
const statRoutes     = require('./routes/statRoutes');

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ─── CORS SETUP ───────────────────────────────────────────────────────────────
// Whitelist all allowed origins, including your Render URLs
const allowedOrigins = [
  'http://localhost:3000',                 // Local React dev
  'http://frontend:3000',                  // Docker Compose internal
  'http://localhost:5000',                 // Backend local
  'https://wbd-eventweb-2.onrender.com',   // Render frontend
  'https://wbd-eventweb.onrender.com'      // (if calling backend↔backend)
];

// Use the array form: Cors will echo back matching origin (not '*')
app.use(cors({
  origin: allowedOrigins,
  credentials: true,   // Access-Control-Allow-Credentials: true
}));

// ─── PARSING MIDDLEWARE ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.raw());

// ─── MONGODB CONNECTION ──────────────────────────────────────────────────────
// Use only the URI string; modern drivers auto-handle parsing options
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventWeb';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── LOGGING SETUP ────────────────────────────────────────────────────────────
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});
app.use(morgan('combined', { stream: accessLogStream }));

// ─── SESSION SETUP ────────────────────────────────────────────────────────────
// SESSION_SECRET signs the cookie. Use an env var or fallback.
app.use(session({
  key:    'userid',
  secret: process.env.SESSION_SECRET || 'your-default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:  1000 * 60 * 60 * 24,  // 1 day
    secure:  false,                // set true if using HTTPS
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// ─── SWAGGER (API DOCS) ──────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventWeb API',
      version: '1.0.0',
      description: 'EventWeb backend endpoints',
    },
    servers: [
      { url: `https://${process.env.HOSTNAME || 'localhost'}:${process.env.PORT || 5000}` }
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/', authRoutes);
app.use('/', dashBoardRoutes);
app.use('/', bookRoutes);
app.use('/', empdashRoutes);
app.use('/', statRoutes);

// ─── START SERVER ────────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
