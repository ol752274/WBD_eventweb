// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

//
// 1️⃣ MANUAL CORS (before everything else)
//
const allowedOrigins = [
  process.env.FRONTEND_URL,             // e.g. https://wbd-eventweb-2.onrender.com
  'https://wbd-eventweb.onrender.com', // for backend→backend if ever needed
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
  // short-circuit preflight
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

//
// 2️⃣ BODY PARSERS & STATIC UPLOADS
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//
// 3️⃣ MONGODB CONNECTION
//
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

//
// 4️⃣ LOGGING
//
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', path: logDir, compress: 'gzip'
});
app.use(morgan('combined', { stream: accessLogStream }));

//
// 5️⃣ SESSION
//
app.use(session({
  name: 'userid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
}));

//
// 6️⃣ ROUTES
//
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/dashBoardRoutes'));
app.use('/', require('./routes/bookRoutes'));
app.use('/', require('./routes/empDashRoutes'));
app.use('/', require('./routes/statRoutes'));

//
// 7️⃣ 404 & ERROR HANDLERS
//
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .set({
      'Access-Control-Allow-Origin': req.headers.origin || '',
      'Access-Control-Allow-Credentials': 'true'
    })
    .json({ error: err.message || 'Internal Server Error' });
});

//
// 8️⃣ START SERVER
//
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server on port ${port}`));
