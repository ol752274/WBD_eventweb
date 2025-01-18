import React from 'react';
import '../../styles/Services/ServiceSection.css'; // Create this CSS file
import service from '../../assests/corporate2.jpg'

const ServicesSection = () => {
    const services = [
    "Corporate Event Planning and Execution",
    "Venue Selection and Booking for Corporate Events",
    "Audio-Visual Equipment Setup and Management",
    "Event Flow and Timeline Coordination",
    "Corporate Branding and Theming for the Event",
    "Guest Registration and RSVP Management",
    "Keynote Speaker and Presenter Arrangements",
    "Team Building Activities and Workshops",
    "Food and Beverage Catering Services",
    "Transport and Logistics for Corporate Guests",
    "Vendor Coordination and Management",
    "Custom Invitation and Communication Services",

    ];

    return (
        <section className="services-section">
            <div className="services-content">
                <img src={service} alt="Coperate Services" className="services-image" />
                <div className="services-description">
                    <h1 className="services-heading">SERVICES THAT WE OFFER:</h1>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}> &#x261E; {service}</li>
                        ))}
                    </ul>
                    <a className='service-action-button' href='/eventform'>Book</a>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
