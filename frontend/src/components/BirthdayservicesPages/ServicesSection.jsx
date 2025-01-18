import React from 'react';
import '../../styles/Services/ServiceSection.css'; // Create this CSS file
import service from '../../assests/wed2.jpg'

const ServicesSection = () => {
    const services = [
"Birthday party décor and design services",
        "Event flow and timeline management",
        "Venue selection and booking for birthday parties",
        "Entertainment activities and games for guests",
        "Guest list management and RSVP tracking",
        "Pre-party planning and theme-based decoration",
        "Food and beverage catering services",
        "Birthday invitation design and communication services",
        "Transport and logistics coordination",
        "Styling and personal shopper services for the birthday person",
        "Vendor management for supplies and entertainment",
        "Birthday gifting solutions",
        "Additional birthday-related event services"
    ];

    return (
        <section className="services-section">
            <div className="services-content">
                <img src={service} alt="Wedding Services" className="services-image" />
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
