import React, { useEffect, useRef, useState } from 'react';
import '../../styles/Footer.css';
import logo from '../../assests/logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect to trigger animation only once
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (observer && footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  return (
    <footer ref={footerRef} className={`footer-footer ${isVisible ? 'fade-in-active' : ''}`}>
      <div className="footer-overlay">
        <div className="footer-container">
          <div className="footer-row">
            <div className="footer-col">
              <img src={logo} alt="Logo" className="footer-footer-logo" />
              <p>
                We are a team of professionals and our passion is the creation and implementation of creative and grand events.
              </p>
              <div className="footer-social-icons">
                <a href="#" className="footer-facebook">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="footer-twitter">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" className="footer-instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="footer-youtube">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>

            <div className="footer-col1">
              <h4>Services We Offer</h4>
              <ul>
                <li>
                  <a href="/Wedding"> Wedding Events</a>
                </li>
                <li>
                  <a href="/Birthday"> Birthday Events</a>
                </li>
                <li>
                  <a href="/social"> Social Events</a>
                </li>
                <li>
                  <a href="/corperate"> Corporate Events</a>
                </li>
              </ul>
            </div>

            <div className="footer-col1">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about"> About Us</a>
                </li>
                <li>
                  <a href="/services">  Services</a>
                </li>
                <li>
                  <a href="/eventform">  Book Event</a>
                </li>
                <li>
                  <a href="/FAQ">  FAQ</a>
                </li>
              </ul>
            </div>

            <div className="footer-col1">
              <h4>Contact Us</h4>
              <ul>
                <li>
                  <a href="#" className="footer-whatsapp"><FontAwesomeIcon icon={faWhatsapp} /> +91 888 701 9899</a>
                </li>
                <li>
                  <a href="#" className="footer-mail"><FontAwesomeIcon icon={faEnvelope} /> EventWeb@email.com</a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="footer-hr" />

          <div className="footer-bottom">
            <div className="footer-col2">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
