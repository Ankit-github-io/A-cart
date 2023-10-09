import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactImageZoom from "react-image-zoom";
import "./ProductImageViewer.css"; // Your custom CSS

const ProductImageViewer = ({ images }) => {
  return (
    <div className="product-image-viewer">
      <Carousel showArrows={true} dynamicHeight={false}>
        {images.map((image, index) => {
          let props = {
            width: "100%",
            height: "auto",
            zoomWidth: 600,
            img: image.url,
          };
          return (
            <div key={index}>
              <ReactImageZoom {...props} />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default ProductImageViewer;
