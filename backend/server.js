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

// ─── 1. CORS (must come before body parsers & routes) ────────────────────────

// Manual CORS: echo the exact origin, allow credentials, handle preflight
const allowedOrigins = [
  'https://wbd-eventweb-2.onrender.com',
  'https://wbd-eventweb.onrender.com',
  'http://localhost:3000',
  'http://frontend:3000',
  'http://localhost:5000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// …

// ─── 2. Body parsing & static uploads ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ─── 3. MongoDB connection ───────────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventWeb';
mongoose
  .connect(mongoURI)  // modern driver auto-parses options
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── 4. Logging setup ────────────────────────────────────────────────────────
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});
app.use(morgan('combined', { stream: accessLogStream }));

// ─── 5. Session setup ────────────────────────────────────────────────────────
app.use(session({
  key: 'userid',
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,  // 1 day
    httpOnly: true,
    sameSite: 'lax',              // allows cross-site on GET
    secure: false,                // set true if using HTTPS
  }
}));

// ─── 6. Swagger (API documentation) ──────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventWeb API',
      version: '1.0.0',
      description: 'API documentation for the EventWeb backend',
    },
    servers: [
      {
        url: `https://${process.env.HOSTNAME || 'localhost'}:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// ─── 7. Route handlers ───────────────────────────────────────────────────────
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/dashBoardRoutes'));
app.use('/', require('./routes/bookRoutes'));
app.use('/', require('./routes/empDashRoutes'));
app.use('/', require('./routes/statRoutes'));

// ─── 8. Global error handler (with CORS headers) ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .header('Access-Control-Allow-Origin', req.headers.origin || '')
    .header('Access-Control-Allow-Credentials', 'true')
    .json({ error: err.message || 'Internal Server Error' });
});

// ─── 9. Start server ─────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
