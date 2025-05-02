// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// ─── 1. MANUAL CORS ────────────────────────────────────────────────────────────
// Pull your production frontend URL from env:
const FRONTEND_URL = process.env.FRONTEND_URL; // e.g. https://wbd-eventweb-2.onrender.com
const allowedOrigins = [
  FRONTEND_URL,
  'https://wbd-eventweb.onrender.com',    // for any backend→backend calls
  'http://localhost:3000',
  'http://frontend:3000',
  'http://localhost:5000',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── 2. BODY PARSERS & STATIC UPLOADS ─────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── 3. MONGODB CONNECTION ────────────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventWeb';
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // exit if DB connection fails
  });

// ─── 4. LOGGING ────────────────────────────────────────────────────────────────
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDir,
  compress: 'gzip',
});
app.use(morgan('combined', { stream: accessLogStream }));

// ─── 5. SESSION SETUP ─────────────────────────────────────────────────────────
app.use(session({
  name: 'userid',
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
}));

// ─── 6. SWAGGER (optional) ────────────────────────────────────────────────────
if (process.env.SWAGGER_ENABLED === 'true') {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'EventWeb API',
        version: '1.0.0',
        description: 'API documentation for the EventWeb backend',
      },
      servers: [
        { url: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`}` }
      ],
    },
    apis: ['./routes/*.js'],
  };
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));
}

// ─── 7. ROUTES ────────────────────────────────────────────────────────────────
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/dashBoardRoutes'));
app.use('/', require('./routes/bookRoutes'));
app.use('/', require('./routes/empDashRoutes'));
app.use('/', require('./routes/statRoutes'));

// ─── 8. 404 HANDLER ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ─── 9. GLOBAL ERROR HANDLER ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res
    .status(err.status || 500)
    .set({
      'Access-Control-Allow-Origin': req.headers.origin || '',
      'Access-Control-Allow-Credentials': 'true'
    })
    .json({ error: err.message || 'Internal Server Error' });
});

// ─── 1️⃣0️⃣ UNCAUGHT EXCEPTIONS & REJECTIONS ───────────────────────────────────
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
