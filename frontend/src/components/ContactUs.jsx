import React from 'react';
import '../styles/ContactUs.css';
import ContactImage from '../assests/contact.png'; // Replace with the correct path

const ContactUs = () => {
  return (
    <div className="main-container">
      <div className="contact-us">
        {/* Image Section */}
        <div className="image-section">
          <img src={ContactImage} alt="Contact Us" />
        </div>

        {/* Info Section */}
        <div className="info-section">
          {/* Call Us */}
          <div className="info-card">
            <h3>Call Us</h3>
            <p><i className="fas fa-phone-alt"></i> +91 888 701 9899</p>
            <p>Available: Monday-Friday, 6:00 am-4:00 pm PT</p>
          </div>

          {/* Email Us */}
          <div className="info-card">
            <h3>Email Us</h3>
            <p><i className="fas fa-envelope"></i> EventWeb@email.com</p>
            <p>Available: Monday-Sunday, 6:00 am-4:00 pm PT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
