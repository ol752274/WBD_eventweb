const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
require('dotenv').config();

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const dashBoardRoutes = require('./routes/dashBoardRoutes');
const bookRoutes = require('./routes/bookRoutes');
const empdashRoutes = require('./routes/empDashRoutes');
const statRoutes = require('./routes/statRoutes');

// Security Middleware
app.use(helmet());

// Static Uploads
app.use('/uploads', express.static('uploads'));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://wbd-eventweb.onrender.com',
  'https://wbd-eventweb-2.onrender.com',
  'http://localhost:3000',
  'http://localhost:5000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

// CORS Middleware (Order is crucial!)
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Session Store
const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Session Configuration (Critical Fix)
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Logging Setup
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});
app.use(morgan('combined', { stream: accessLogStream }));

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventWeb API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [{
      url: process.env.NODE_ENV === 'production' 
        ? 'https://wbd-eventweb.onrender.com' 
        : 'http://localhost:5000',
    }]
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

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    dbState: mongoose.connection.readyState,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});