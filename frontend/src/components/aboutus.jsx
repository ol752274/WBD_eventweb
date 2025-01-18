import React from "react";
import "../styles/AboutUs.css";
import Navbar from "../components/Indexpage/Navbar";
import weddingImg from "../assests/images/wedding.png";
import corporateImg from "../assests/images/corporate.png";
import birthdayImg from "../assests/images/birthday.png";
import socialImg from "../assests/images/social.png";
import gallery1 from "../assests/images/gallery1.png";
import gallery2 from "../assests/images/gallery2.png";
import gallery3 from "../assests/images/gallery3.png";
import gallery4 from "../assests/images/gallery4.png";
import gallery6 from "../assests/images/bir2.jpg";
import gallery7 from "../assests/images/soc2.jpeg";
import gallery8 from "../assests/images/cor2.jpg";
import gallery9 from "../assests/images/cor3.jpg";
import gallery10 from "../assests/images/soc3.jpg";
import gallery11 from "../assests/images/wed3.png";
import gallery12 from "../assests/images/wed4.jpg";
import gallery13 from "../assests/images/bir4.jpg";
import gallery14 from "../assests/images/cor5.jpeg";
import gallery15 from "../assests/images/bir6.jpg";
import Footer from "../components/Indexpage/Footer"



const AboutUs = () => {
  // Reusable renderServices function with options for heading and custom images and custom text
  const renderServices = (showHeading = true, customImages = null, customDescriptions = null) => {
    const images = customImages || [weddingImg, corporateImg, birthdayImg, socialImg];
    const serviceTitles = [
      "Wedding Ceremonies",
      "Corporate Events",
      "Birthday Parties",
      "Social Gatherings",
    ];
    const serviceDescriptions = customDescriptions || [
      "Your wedding, our perfection. Creating magical moments for your special day.",
      "Corporate events that leave lasting impressions and foster professional connections.",
      "Making birthday parties unforgettable with custom decorations and entertainment.",
      "Social events designed to bring people together and create memories to cherish."
    ];

    return (
      <section className="about-services">
        {showHeading && <h2>Our Services</h2>}
        <div className="service-container">
          {images.map((image, index) => (
            <div key={index} className="service-item">
              {index % 2 === 0 ? (
                <>
                  <img src={image} alt={serviceTitles[index]} className="service-image" />
                  <div className="service-text">
                    <h2>{serviceTitles[index]}</h2>
                    <p>{serviceDescriptions[index]}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="service-text">
                    <h2>{serviceTitles[index]}</h2>
                    <p>{serviceDescriptions[index]}</p>
                  </div>
                  <img src={image} alt={serviceTitles[index]} className="service-image" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar />
      <div className="about-container">
        <header className="about-header">
          <h1>About Us</h1>
        </header>

        <section className="about-intro">
          <div className="intro-content">
            <p>
            Established in 2024 in Sricity and Chennai, Event Web was created with the sole aim of making every event a grand success. With over 9 years of experience in the event planning industry, we have had the privilege of organizing more than 500 unforgettable events. Our expertise spans across a wide range of events, including extravagant weddings, corporate gatherings, milestone celebrations, and bespoke parties tailored to your specific needs. Our passionate and dedicated team of professionals ensures that every detail, from the smallest element to the largest aspect, aligns perfectly with your vision, creating events that are truly memorable. 
            </p>
          </div>
          <div className="intro-images">
            <div className="intro-images-left">
              <img src={gallery1} alt="Gallery Image 1" className="intro-img" />
              <img src={gallery2} alt="Gallery Image 2" className="intro-img" />
            </div>
            <div className="intro-images-right">
              <img src={gallery3} alt="Gallery Image 3"  className="intro-img" />
            </div>
          </div>
        </section>

        {/* Render Our Services section with different configurations */}
        {renderServices(true, [gallery12, gallery14, gallery15, gallery4], [
          "We specialize in bringing your dream wedding to life. Every detail is tailored to your desires, making your day unforgettable.",
          "Our corporate events are designed to impress, offering a perfect blend of professionalism and creativity.",
          "We create exciting and personalized birthday parties that guests of all ages will love, from decorations to entertainment.",
          "From intimate gatherings to large celebrations, our social events cater to all needs, ensuring fun and lasting memories."
        ])}
        
        {renderServices(false, [gallery11, gallery8, gallery6, gallery7], [
          "Our wedding planning services are renowned for their creativity, attention to detail, and flawless execution.",
          "We excel in organizing corporate events that foster networking, collaboration, and celebration in a professional environment.",
          "Bespoke birthday party experiences, curated to match every age group and personality, ensuring a perfect celebration.",
          "Creating joyful and memorable social events for all occasions, whether small or large, indoors or outdoors."
        ])}
        
        {renderServices(false, [gallery1, gallery9, gallery13, gallery10], [
          "From intimate weddings to large grand celebrations, we ensure every moment is perfect and every guest feels special.",
          "Corporate gatherings are made easy with our expert team, offering seamless coordination and top-tier event management.",
          "Birthday celebrations that exceed expectations, with unique themes and entertainment options for every guest.",
          "Creating vibrant social gatherings that bring people together in unforgettable ways."
        ])}

        <section className="about-gallery"> 
          <h2>Gallery</h2>
          <div className="gallery-container">
            <img src={gallery1} alt="Gallery Image 1" className="gallery-image" />
            <img src={gallery2} alt="Gallery Image 2" className="gallery-image" />
            <img src={gallery3} alt="Gallery Image 3" className="gallery-image" />
            <img src={gallery4} alt="Gallery Image 4" className="gallery-image" />
          </div>
        </section>

        <section className="call-to-action">
          <h2>Let's Make Your Event Extraordinary</h2>
          <button onClick={() => (window.location.href = "/register")}>
            Register With Us
          </button>
        </section>
      </div>
      <Footer></Footer>
    </>
  );
};

export default AboutUs;