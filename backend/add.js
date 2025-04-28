require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Role = require('./models/Roles'); // Adjust path if needed

const saltRounds = 10;
const mongoDB = process.env.MONGODB_URI; // Use environment variable

const addOrUpdateRole = async (email, role, password) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoDB);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const existingRole = await Role.findOne({ email });

    if (existingRole) {
      existingRole.password = hashedPassword;
      await existingRole.save();
      console.log('Password updated successfully');
    } else {
      const newRole = new Role({ email, role, password: hashedPassword });
      await newRole.save();
      console.log('Role and password added successfully');
    }
  } catch (error) {
    console.error('Error in adding/updating role:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Example usage
const email = 'chethan@gmail.com';
const role = 'Admin';
const password = '12345678@';

addOrUpdateRole(email, role, password);
