import ReactStars from "react-rating-stars-component";
import React from "react";

const ReviewCard = ({ review }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: review.rating,
    isHalf: true,
  };
  let src = review?.avatar;
  return (
    <div className="reviewCard">
      <img src={src || "/Profile.png"} alt="User" />
      <p className="userName">{review.name}</p>
      <ReactStars {...options} />
      <p className="reviewCardComment">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
