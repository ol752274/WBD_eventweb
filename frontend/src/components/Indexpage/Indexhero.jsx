import React, { useEffect, useState } from 'react';
import hero1 from '../../assests/wed7.jpg';
import hero2 from '../../assests/hero2.jpg';
import hero3 from '../../assests/wed9.jpg';
import hero4 from '../../assests/birthday9.jpg';
import hero5 from '../../assests/birthday10.jpg';
import hero6 from '../../assests/corporate4.jpg';
import hero7 from '../../assests/hero7.jpg';
import hero8 from '../../assests/hero8.jpg';
import hero9 from '../../assests/hero9.jpg';
import hero10 from '../../assests/hero10.jpg';
import hero11 from '../../assests/hero11.jpg';
import '../../styles/Indexhero.css'

const ImageSlideshow = () => {
  const images = [
    hero1, hero2, hero3, hero4, hero5, hero6, hero7, hero8, hero9, hero10, hero11
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const interval = 2000; // Change this to adjust the delay between slides

  useEffect(() => {
    const showImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const timer = setTimeout(showImage, interval);

    return () => clearTimeout(timer);
  }, [currentIndex, images]);

  return (
    <div className="hero-con-imageContainer">
      <div className="hero-con-overlay">
        <h1 className="hero-con-title">Event Web</h1>
        <p className="hero-con-heroText">Your Vision, Our Expertise. Let's Create Unforgettable Moments Together!</p>
        <p className="hero-con-welcomeText">Welcome to Event Web, your ultimate event management partner.</p>
        <a href="/eventform" className="hero-con-ctaButton">Plan Your Event</a>
      </div>

      {images.map((image, index) => (
        <div
          key={index}
          className="hero-con-imageWrapper"
          style={{
            display: currentIndex === index ? 'block' : 'none',
          }}
        >
          <img
            src={image}
            alt={`Image ${index + 1}`}
            className="hero-con-image"
          />
          <div className="hero-con-darkOverlay"></div>
        </div>
      ))}
    </div>
  );
};

export default ImageSlideshow;
