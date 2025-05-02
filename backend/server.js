const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// 1) Trust proxy (needed for secure cookies behind a load‑balancer)
app.set('trust proxy', 1);

// 2) CORS: allow your React app’s origin and send cookies
const allowedOrigins = [
  'http://localhost:3000',
  'https://wbd-eventweb.onrender.com'  // ← make sure this matches exactly
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// 3) Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4) MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventWeb';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 5) Logging
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const accessLog = rfs.createStream('access.log', { interval: '1d', path: logDir, compress: 'gzip' });
app.use(morgan('combined', { stream: accessLog }));

// 6) Sessions (Mongo‑backed, cross‑site cookies)
app.use(session({
  secret: process.env.SESSION_SECRET || 'project',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }),
  cookie: {
    secure: true,        // only over HTTPS
    httpOnly: true,
    sameSite: 'none',    // allow cross‑site
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 7) Optional: populate req.user for downstream handlers
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const User = require('./models/User');
      req.user = await User.findById(req.session.userId);
    } catch (e) {
      console.error('Session user load error:', e);
    }
  }
  next();
});

// 8) Static uploads
app.use('/uploads', express.static('uploads'));

// 9) Swagger
const swaggerOpts = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'EventWeb API', version: '1.0.0' },
    servers: [{ url: `https://${process.env.HOSTNAME || 'localhost'}:${process.env.PORT || 5000}` }]
  },
  apis: ['./routes/*.js']
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOpts)));

// 10) Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/dashBoardRoutes'));
app.use('/', require('./routes/bookRoutes'));
app.use('/', require('./routes/empDashRoutes'));
app.use('/', require('./routes/statRoutes'));

// Start
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
