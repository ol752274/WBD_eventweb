import React from 'react';
import '../../styles/Services/ServiceSection.css'; // Create this CSS file
import service from '../../assests/social2.jpeg'

const ServicesSection = () => {
    const services = [
        "Entertainment and live performance arrangements",
        "Guest list management and RSVP tracking",
        "Catering and food & beverage services",
        "Invitation design and distribution",
        "Transport and logistics management",
        "Party favors and gifting solutions",
        "Event photography and videography services",
        "Music and sound system setup",
        "Event security and crowd management",
        "Styling and personal shopper services for hosts",
        "Vendor management for supplies and entertainment",
        "Post-event cleanup and disposal",
        "Event marketing and promotion",   
    ];

    return (
        <section className="services-section">
            <div className="services-content">
                <img src={service} alt="Social Services" className="services-image" />
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
