import React, { useState } from 'react';
import '../../styles/Services/PhotosSection.css'; // Make sure the CSS path is correct

// Import images
import wed3 from '../../assests/wed3.jpg';
import wed4 from '../../assests/wed4.jpeg';
import wed5 from '../../assests/wed5.jpeg';
import wed6 from '../../assests/wed6.jpg';
import wed7 from '../../assests/wed7.jpg';
import wed8 from '../../assests/wed8.jpg';
import wed9 from '../../assests/wed9.jpg';
import wed10 from '../../assests/wed10.jpg';
import wed11 from '../../assests/wed11.jpg';

const PhotosSection = () => {
    const [modalImage, setModalImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        wed3,
        wed4,
        wed5,
        wed6,
        wed7,
        wed8,
        wed9,
        wed10,
        wed11
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
