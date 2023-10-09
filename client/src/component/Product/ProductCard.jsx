import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./ProductCard.css";

const Product = ({ product }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 19 : 24,
    value: product.ratings,
    isHalf: true,
  };
  return (
    product && (
      <Link className="productCard" to={`/product/${product._id}`}>
        <img src={product?.images[0].url} alt={product.name} />
        <div className="cardContent">
          <p className="productName">{product.name}</p>
          <div>
            <ReactStars {...options} />
            <span>({product.numberOfReviews} Review)</span>
          </div>
          <p className="price">{`₹${product.price}`}</p>
        </div>
      </Link>
    )
  );
};

export default Product;
