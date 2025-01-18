import React, { useState } from 'react';
import '../../styles/Services/PhotosSection.css'; // Make sure the CSS path is correct

// Import images
import corp3 from '../../assests/corporate3.jpg';
import corp4 from '../../assests/corporate4.jpg';
import corp5 from '../../assests/corporate5.jpeg';
import corp6 from '../../assests/corporate6.jpg';
import corp7 from '../../assests/corporate7.png';
import corp8 from '../../assests/corporate8.png';
import corp9 from '../../assests/corporate9.png';
import corp10 from '../../assests/corporate10.png';
import corp11 from '../../assests/corporate11.png';

const PhotosSection = () => {
    const [modalImage, setModalImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        corp3,
        corp4,
        corp5,
        corp6,
        corp7,
        corp8,
        corp9,
        corp10,
        corp11
    ];

    const openModal = (index) => {
        setModalImage(images[index]);
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    const changeImage = (direction) => {
        const newIndex = (currentIndex + direction + images.length) % images.length;
        setModalImage(images[newIndex]);
        setCurrentIndex(newIndex);
    };

    return (
        <section className="photos-section">
            <h2>Photos of Our Events</h2>
            <div className="photos-row">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Event Photo ${index + 1}`}
                        className="photo"
                        onClick={() => openModal(index)} // Open modal with the clicked image index
                    />
                ))}
            </div>

            {/* Modal for displaying the selected image */}
            {modalImage && (
                <div className="modal">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <img className="modal-content" src={modalImage} alt="Modal" />
                    <div className="navigation">
                        <button className="prev" onClick={() => changeImage(-1)}>&#10094;</button>
                        <button className="next" onClick={() => changeImage(1)}>&#10095;</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PhotosSection;
