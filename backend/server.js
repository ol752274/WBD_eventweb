const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const empdashRutes =require('./routes/empDashRoutes')
const statRoutes = require('./routes/statRoutes')

app.use('/uploads', express.static('uploads'))

const authRoutes = require('./routes/authRoutes');
const dashBoardRoutes = require('./routes/dashBoardRoutes'); // Import dashboard routes
const bookRoutes = require('./routes/bookRoutes');
// Setup CORS
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend URL
  credentials: true,
}));

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/EventWeb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Session setup
app.use(session({
  key: "userid",
  secret: "project",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24 * 1000, // 1 day
    secure: false,  // Allow HTTP for development (set to true for production with HTTPS)
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: 'Lax', // Helps mitigate CSRF attacks
  }
}));

// Mount the auth and dashboard routes
app.use('/', authRoutes);
app.use('/', dashBoardRoutes);
app.use('/',bookRoutes);
app.use('/',empdashRutes);
app.use('/',statRoutes);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
