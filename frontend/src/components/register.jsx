import React, { useState } from 'react';
import '../styles/register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    maritalStatus: '',
    dob: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: '',
    experience: '',
    skills: '',
    password: '',
    confirmPassword: '',
    profileImage: null, // New field for the profile image
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // If the field is a file input, store the file, otherwise store the value
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const { email, phone, password, confirmPassword, profileImage } = formData;

    // Email format validation
    const emailRegex = /^[^\s@]+@gmail\.com$/;;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    // Phone number validation (assuming 10 digits for example)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return false;
    }

    // Password validation (minimum 6 characters for example)
    
    const passwordPattern = /^(?=.*[!@#$%^&]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one special character.');
      return false;
    }
    

    // Confirm password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    // Profile image validation (optional)
    if (profileImage) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(profileImage.type)) {
        setErrorMessage('Only JPEG and PNG image formats are allowed');
        return false;
      }

      // File size validation (e.g., 2MB max)
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (profileImage.size > maxFileSize) {
        setErrorMessage('Profile image size should be less than 2MB');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create a FormData object to send the form data, including the file
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        body: form, // Send the form data, including the image
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Employee registered successfully!');
        setErrorMessage(''); // Clear any error message
        setFormData({
          firstName: '',
          lastName: '',
          maritalStatus: '',
          dob: '',
          email: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          country: '',
          experience: '',
          skills: '',
          password: '',
          confirmPassword: '',
          profileImage: null,
        }); // Clear form
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
    <>
      <div className="whole-register">
        <div className="reg-container">
          <h2>Employee Registration Form</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Personal Information */}
            <h3>Personal Information</h3>
            <div className="reg-form-group">
              <input type="text" id="firstName" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} />
              <input type="text" id="lastName" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="reg-form-group">
              <select id="maritalStatus" name="maritalStatus" required value={formData.maritalStatus} onChange={handleChange}>
                <option value="" disabled>Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
              <input type="date" id="dob" name="dob" placeholder="Date of Birth" required value={formData.dob} onChange={handleChange} />
            </div>

            {/* Contact Information */}
            <h3>Contact Information</h3>
            <div className="reg-form-group">
              <input type="email" id="email" name="email" placeholder="E-mail" required value={formData.email} onChange={handleChange} />
              <input type="text" id="phone" name="phone" placeholder="Mobile Number" required value={formData.phone} onChange={handleChange} />
            </div>

            {/* Address Information */}
            <h3>Address</h3>
            <div className="reg-form-group">
              <input type="text" id="street" name="street" placeholder="Street Address" required value={formData.street} onChange={handleChange} />
              <input type="text" id="city" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
              <input type="text" id="state" name="state" placeholder="State / Province" required value={formData.state} onChange={handleChange} />
              <input type="text" id="country" name="country" placeholder="Country" required value={formData.country} onChange={handleChange} />
            </div>

            {/* Work Experience */}
            <h3>Work Experience</h3>
            <div className="reg-form-group">
              <textarea id="experience" name="experience" rows="5" placeholder="Describe your previous work experience" required value={formData.experience} onChange={handleChange}></textarea>
            </div>

            {/* Skills */}
            <h3>Skills</h3>
            <div className="reg-form-group">
              <textarea id="skills" name="skills" rows="4" placeholder="List your skills here" required value={formData.skills} onChange={handleChange}></textarea>
            </div>

            {/* Profile Image */}
            <h3>Upload Profile Image</h3>
            <div className="reg-form-group">
              <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
            </div>

            {/* Password Fields */}
            <h3>Account Information</h3>
            <div className="reg-form-group">
              <input type="password" id="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <button type="submit">REGISTER ME</button>
            {errorMessage && <div className="error">{errorMessage}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;