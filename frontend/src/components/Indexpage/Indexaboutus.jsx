import React, { useEffect, useRef, useState } from 'react';
import '../../styles/Indexaboutus.css';
import about1 from '../../assests/about1.jpg';
import about2 from '../../assests/about2.jpg';
import about3 from '../../assests/about3.jpg';

export default function Indexaboutus() {
  const aboutRef = useRef(null);
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

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (observer && aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  return (
    <div>
      <section
        ref={aboutRef}
        className={`about-section ${isVisible ? 'fade-in-active' : ''}`}
      >
        <div className="about-content">
          <div className="about-text">
            <h1>About Us</h1>
            <p>
              Established in 2024, Event Web has been created with the sole aim of making every event successful and till date, we have happily and successfully executed a number of events ranging from wedding, corporate, special events management, sports management, and numerous other bespoke events in India. Our team always ensures that they design every event with their extensive capabilities and knowledge to bring our customer’s vision to life.
            </p>
            <a className="cta-button" href='/about'>Call to Action</a>
          </div>
          <div className="about-images">
            <img src={about1} alt="Bride at an event" className="about-image image-1" />
            <img src={about2} alt="DJ setup at a birthday party" className="about-image image-2" />
            <img src={about3} alt="Table setup for event" className="about-image image-3" />
          </div>
        </div>
      </section>
    </div>
  );
}
