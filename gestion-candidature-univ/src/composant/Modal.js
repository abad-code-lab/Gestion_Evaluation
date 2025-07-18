// Modal.js
import React from "react";
import "./Modal.css"; // Ajouter le CSS pour le modal

const Modal = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  if (!isOpen) return null;

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <img src={images[currentIndex]} alt="Aperçu" className="modal-image" />
        {/* <button className="nav-button prev" onClick={handlePrev}>❮</button>
        <button className="nav-button next" onClick={handleNext}>❯</button> */}
      </div>
    </div>
  );
};

export default Modal;
