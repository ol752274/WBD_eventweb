import React, { useEffect, useRef, useState } from "react";
import "../../styles/Testimonials.css";

const testimonialsData = [
  {
    name: "John Doe",
    designation: "CEO, TechCorp",
    message:
      "The team did an amazing job organizing our corporate event. Every detail was perfect, and the execution was flawless.",
  },
  {
    name: "Jane Smith",
    designation: "Bride",
    message:
      "They turned my wedding dreams into reality. Everything was magical, and I couldn’t have asked for more.",
  },
  {
    name: "Mark Wilson",
    designation: "Event Organizer",
    message:
      "From planning to execution, the team was outstanding. They made our social gathering a huge success.",
  },
  {
    name: "Emily Davis",
    designation: "Marketing Director, HealthCo",
    message:
      "The product launch event was seamless and impactful. The creativity and professionalism of the team were top-notch!",
  },
  {
    name: "Alex Johnson",
    designation: "Groom",
    message:
      "Our wedding was beyond beautiful, and the attention to detail made it unforgettable. Highly recommend their services!",
  },
  {
    name: "Sophia Lee",
    designation: "Conference Coordinator",
    message:
      "The annual conference was executed flawlessly. Attendees praised the smooth logistics and beautiful decor.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger animation only once
        }
      },
      { threshold: 0.5 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (observer && testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2) % testimonialsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonialsData.length - 2 : prevIndex - 2
    );
  };

  return (
    <section
      ref={testimonialsRef}
      className={`testimonials-section ${isVisible ? "fade-in-active" : ""}`}
    >
      <h2 className="testimonials-heading">What Our Clients Say</h2>
      <div className="testimonial-row">
        {testimonialsData.slice(currentIndex, currentIndex + 2).map((testimonial, index) => (
          <div key={index} className={`testimonial-card fade-in-delay-${index}`}>
            <div className="testimonial-content">
              <p className="testimonial-message">"{testimonial.message}"</p>
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-designation">{testimonial.designation}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-navigation">
        <button className="nav-button-1" onClick={handlePrev}>
          &lt;
        </button>
        <button className="nav-button-1" onClick={handleNext}>
          &gt;
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
