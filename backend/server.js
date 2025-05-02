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

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const dashBoardRoutes = require('./routes/dashBoardRoutes');
const bookRoutes = require('./routes/bookRoutes');
const empdashRoutes = require('./routes/empDashRoutes');
const statRoutes = require('./routes/statRoutes');

// Static Uploads
app.use('/uploads', express.static('uploads'));

// Allowed Origins
const allowedOrigins = [
  process.env.FRONTEND_URL,            // from .env
  'https://wbd-eventweb.onrender.com', // backend (self)
  'http://localhost:3000',
  'http://frontend:3000',
  'http://localhost:5000',
];
console.log('🛠️ Allowed Origins:', allowedOrigins);

// CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

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

// Session Configuration
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

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventWeb API Documentation',
      version: '1.0.0',
      description: 'API documentation for the EventWeb backend',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Adjust in prod if needed
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', authRoutes);
app.use('/', dashBoardRoutes);
app.use('/', bookRoutes);
app.use('/', empdashRoutes);
app.use('/', statRoutes);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
