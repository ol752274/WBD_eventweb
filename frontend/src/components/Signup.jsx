import React, { useState } from 'react';
import '../styles/login.css';
import { Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',  // Add phone number field
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Phone number validation
    if (name === "phone") {
      const isNumeric = /^[0-9]*$/;
  
      // Only update state if it's numeric and not longer than 10 digits
      if (isNumeric.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
    }
  
    // Password validation: ensure at least one special character
    else if (name === "password") {
      // Update state without validation alert
      setFormData({ ...formData, [name]: value });
    }
  
    // Handle other fields without validation
    else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
    // Other fields
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (formData.phone.length !== 10) {
      alert("Phone number should be exactly 10 digits.");
      return;
    }
  
    // Validate password length and special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (formData.password.length <= 8 || !specialCharRegex.test(formData.password)) {
      alert("Password must be more than 8 characters long and contain at least one special character.");
      return;
    }
    
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(formData.email)) {
    alert("Only @gmail.com email addresses are allowed.");
    return;
  }
  
    // If all validations pass, proceed with form submission
    console.log("Form submitted successfully", formData);
  
    const { password, confirmPassword } = formData;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setSuccessMessage(''); // Clear success message
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),  // Include phone number in the payload
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('User registered successfully!'); // Set success message
        setErrorMessage(''); // Clear any error message
        setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' }); // Clear form
      } else {
        setErrorMessage(result.error || 'An error occurred');
        setSuccessMessage(''); // Clear success message
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Server error');
      setSuccessMessage(''); // Clear success message
    }
  };

  return (
    <div className='whole-login-page'>
      <div className="login-container">
        <div className="login-left">
          {/* Background image instead of stripes */}
        </div>
        <div className="login-right">
          <div className="login-box">
            <div className="logo">Event Web</div>
            <h2>Hi Welcome</h2>
            <form id="signup-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text" // Use text type for phone number
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit" className="sign-in-button">Register</button>
              {errorMessage && <div id="error-message" className="error">{errorMessage}</div>}
              {successMessage && <div id="success-message" className="success">{successMessage}</div>}
            </form>
            <p className="signup-link">Do you have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;