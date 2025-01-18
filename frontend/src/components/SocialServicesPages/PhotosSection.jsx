import React, { useState } from 'react';
import '../../styles/Services/PhotosSection.css'; // Make sure the CSS path is correct

// Import images
import social3 from '../../assests/social3.jpg';
import social4 from '../../assests/social4.jpg';
import social5 from '../../assests/social5.jpg';
import social6 from '../../assests/social6.jpg';
import social7 from '../../assests/social7.png';
import social8 from '../../assests/social8.jpeg';
import social9 from '../../assests/social9.jpg';
import social10 from '../../assests/social10.jpg';
import social11 from '../../assests/social11.jpg';

const PhotosSection = () => {
    const [modalImage, setModalImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        social3,
        social4,
        social5,
        social6,
        social7,
        social8,
        social9,
        social10,
        social11
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
