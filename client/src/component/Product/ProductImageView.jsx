import React, { useState } from "react";
import "./ProductImageView.css";

const ProductImageView = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showPrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="product-container">
      <div className="image-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`Product img ${index + 1}`}
            className={index === currentImageIndex ? "active" : ""}
          />
        ))}
      </div>
      <div className="product-info">
        {/* Product information goes here (e.g., product name, price, description, etc.) */}
      </div>
      <div className="image-navigation">
        <button onClick={showPrevImage}>Previous</button>
        <button onClick={showNextImage}>Next</button>
      </div>
    </div>
  );
};

export default ProductImageView;
