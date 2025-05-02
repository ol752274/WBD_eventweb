const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
require('dotenv').config();

const app = express();

// =======================
// Enhanced Configuration
// =======================
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret_should_be_changed';
const FRONTEND_URLS = [
  process.env.FRONTEND_URL,
  'https://wbd-eventweb.onrender.com',
  'https://wbd-eventweb-2.onrender.com',
  'http://localhost:3000'
];

// =============
// Middlewares
// =============
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000 // limit each IP requests
});
app.use(limiter);

// ==============
// CORS Setup
// ==============
app.use(cors({
  origin: 'https://wbd-eventweb-2.onrender.com',
  credentials: true,
}));
app.options('*', cors(corsOptions));

// ================
// Database Setup
// ================
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: !isProduction
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

// =================
// Session Setup
// =================
const sessionStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 // 24 hours
});

sessionStore.on('error', (error) => {
  console.error('Session store error:', error);
});

app.use(session({
  name: 'sessionId',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000,
    domain: isProduction ? '.onrender.com' : undefined
  }
}));

// ==============
// Logging
// ==============
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});

app.use(morgan(isProduction ? 'combined' : 'dev', { 
  stream: isProduction ? accessLogStream : process.stdout 
}));

// ==============
// Swagger Docs
// ==============
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventWeb API',
      version: '1.0.0',
      description: 'API documentation with security',
    },
    servers: [{
      url: isProduction 
        ? 'https://wbd-eventweb.onrender.com' 
        : `http://localhost:${PORT}`,
    }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sessionId'
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==============
// Routes
// ==============
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashBoardRoutes'));
app.use('/api/v1/books', require('./routes/bookRoutes'));
app.use('/api/v1/emp', require('./routes/empDashRoutes'));
app.use('/api/v1/stats', require('./routes/statRoutes'));

// ===================
// Health Check
// ===================
app.get('/health', (req, res) => res.status(200).json({
  status: 'ok',
  uptime: process.uptime(),
  timestamp: Date.now()
}));

// ===================
// Error Handling
// ===================
app.use((req, res) => {
  res.status(404).json({ 
    status: 'fail', 
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = isProduction ? 'Something went wrong' : err.message;

  if (isProduction) {
    console.error('Production Error:', {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl
    });
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(!isProduction && { stack: err.stack })
  });
});

// ==============
// Server Start
// ==============
const server = app.listen(PORT, () => {
  console.log(`
  Server running in ${process.env.NODE_ENV || 'development'} mode
  Listening on port ${PORT}
  MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
  Allowed origins: ${FRONTEND_URLS.join(', ')}
  `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});