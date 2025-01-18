const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt
const Role = require('./models/Roles'); // Adjust the path as necessary

const mongoDB = 'mongodb://localhost:27017/EventWeb'; // Your MongoDB connection string
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const saltRounds = 10; // Define the number of salt rounds for bcrypt

const addOrUpdateRole = async (email, role, password) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if a user with the email already exists
    const existingRole = await Role.findOne({ email });

    if (existingRole) {
      // Update the existing user's password with the hashed password
      existingRole.password = hashedPassword;
      await existingRole.save();
      console.log('Password updated successfully');
    } else {
      // Create a new role entry with the hashed password if the user does not exist
      const newRole = new Role({ email, role, password: hashedPassword });
      await newRole.save();
      console.log('Role and password added successfully');
    }
  } catch (error) {
    console.error('Error in adding/updating role:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Use the specified email, role, and password
const email = 'chethan@gmail.com';
const role = 'Admin';
const password = '12345678@'; // Set the new password here

addOrUpdateRole(email, role, password);
