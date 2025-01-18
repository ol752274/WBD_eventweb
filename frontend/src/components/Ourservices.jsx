import React from 'react';
import '../styles/Ourservices.css';
import video from '../assests/services.mp4'
import Footer from '../components/Indexpage/Footer'

const Services = () => {
  return (
    <div className="services-container">
      <div className="header-section">
        <h1>Our Services</h1>
      </div>
      <div className="description-video-section">
        <div className="description">
          <h2>You Name It! We Do It!!</h2>
          <p>
            At EventWeb, we believe in You Name It, We Do It! From concept
            to execution, we handle every detail with expertise and flair. Whether
            it's a dazzling wedding, a corporate function, or a vibrant party, our
            comprehensive services ensure that your vision comes to life
            effortlessly. Let us take care of everything, so you can enjoy a
            seamless and extraordinary event experience.
          </p>
        </div>
        <div className="video-section">
          <video autoPlay loop muted playsInline>
            <source src={ video } type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="services-grid">
        <h3>Our Services Include</h3>
        <div className="services-list">
          <div className="service-item">
            <i className="icon">👩‍🎤</i>
            <p>Artist Celebrity Management</p>
          </div>
          <div className="service-item">
            <i className="icon">💍</i>
            <p>Weddings</p>
          </div>
          <div className="service-item">
            <i className="icon">👗</i>
            <p>Fashion Show</p>
          </div>
          <div className="service-item">
            <i className="icon">🏢</i>
            <p>Corporate Events</p>
          </div>
          <div className="service-item">
            <i className="icon">✂</i>
            <p>Inaugural Events</p>
          </div>
          <div className="service-item">
            <i className="icon">🎂</i>
            <p>Birthdays</p>
          </div>
          <div className="service-item">
            <i className="icon">🎶</i>
            <p>Music Events</p>
          </div>
          <div className="service-item">
            <i className="icon">🎉</i>
            <p>Mall Decor / Festival</p>
          </div>
          <div className="service-item">
            <i className="icon">💡</i>
            <p>Sounds & Lights</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Services;