import React from 'react';
import '../../styles/Services/ServiceSection.css'; // Create this CSS file
import service from '../../assests/wed2.jpg'

const ServicesSection = () => {
    const services = [
        "Wedding décor and design services",
        "Event flow management",
        "Destination wedding planning & venue selection",
        "Entertainment activities for wedding guests",
        "Wedding guest’s management",
        "Pre wedding event decoration & party organization",
        "Food and beverage services",
        "Wedding invitation & other communication services",
        "Transport & logistics management",
        "Styling & personal shopper",
        "Vendor Management",
        "Wedding Gifting Solutions",
        "Other wedding solutions"
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
