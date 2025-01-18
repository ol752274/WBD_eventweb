import React, { useEffect, useRef, useState } from 'react';
import '../../styles/Indexservices.css';
import service1 from '../../assests/service1.jpg';
import service2 from '../../assests/service2.jpeg';
import service3 from '../../assests/service3.jpg';
import service4 from '../../assests/service4.jpg';

function IndexServices() {
  const servicesRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect to ensure animation triggers only once
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (observer && servicesRef.current) observer.unobserve(servicesRef.current);
    };
  }, []);

  return (
    <div ref={servicesRef} className={`services ${isVisible ? 'fade-in-active' : ''}`}>
      <div className="intro-text">
        <h1>Services</h1>
        <p>
          We are a dynamic team of event planning professionals that India
          trusts with her most special affairs as we offer perfection through
          our international standard coordination services with comprehensive
          planning. So come let's make your dream event a reality!
        </p>
      </div>

      <div className="big-service-grid">
        <div className="service-grid">
          <div className="service-item-wedding" id="wedding-image">
            <h4>01 </h4>
            <img src={service1} alt="Wedding Service" />
            <hr id="wedding-hr" />
            <p>Wedding</p>
            <a id="wedding-more" href="/wedding">more</a>
          </div>

          <div className="service-item-birthday" id="birthday-image">
            <h4>02 </h4>
            <img src={service2} alt="Birthday Service" />
            <hr id="birthday-hr" />
            <p>Birthday Parties</p>
            <a id="birthday-more" href="/birthday">more</a>
          </div>
        </div>

        <div className="service-grid">
          <div className="service-item-social" id="social-image">
            <h4>04 </h4>
            <img src={service3} alt="Social Event" />
            <hr id="social-hr" />
            <p>Social Events</p>
            <a id="social-more" href="/social">more</a>
          </div>

          <div className="service-item-corperate" id="corporate-image">
            <h4>03 </h4>
            <img src={service4} alt="Corporate Event" />
            <hr id="corporate-hr" />
            <p>Corporate<br /> Events</p>
            <a id="corporate-more" href="/corperate">more</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndexServices;
