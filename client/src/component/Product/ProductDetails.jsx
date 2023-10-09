import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/loader/Loader";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import { Rating } from "react-simple-star-rating";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState();
  const [imageArray, setImageArray] = useState([]);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      return;
    }
    setQuantity(quantity + 1);
  };
  const addToCart = () => {
    if (product.stock > 0) {
      dispatch(addItemsToCart(id, quantity));
      toast.success("Add Item to Cart Successfully");
    } else {
      toast.info("Out of stock");
    }
  };
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const submitReview = () => {
    if (!rating) {
      toast.error("Please provide a star rating before submitting.");
      return;
    }

    let data = { rating, comment, productId: id };
    dispatch(newReview(data)).then(() => {
      setOpen(false);
      setRating(null);
      setComment("");
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
      dispatch(getProductDetails(id));
    }
  }, [dispatch, error, success, id, reviewError]);
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (product) {
      setImageArray(() =>
        product.images.map((item) => (
          <>
            <img src={item.url} alt="productImage" height={100} width={100} />
          </>
        ))
      );
    }
  }, [product]);

  return (
    <>
      <div className="productDetailPage">
        {loading ? (
          <Loader />
        ) : (
          product && (
            <>
              <MetaData title={`${product.name}-ACart`} />
              <div className="ProductDetails">
                <div className="carouselContainer">
                  <Carousel
                    animation="fade"
                    duration={200}
                    stopAutoPlayOnHover
                    fullHeightHover={true}
                    swipe={true}
                    className="carousal"
                    autoPlay={true}
                    IndicatorIcon={imageArray}
                    navButtonsAlwaysInvisible
                    indicatorIconButtonProps={{
                      className: "imgIndicator",
                    }}
                    activeIndicatorIconButtonProps={{
                      className: "imgIndicatorActive",
                    }}
                    indicatorContainerProps={{
                      className: "imgIndicatorContainer scrollbarH",
                    }}
                  >
                    {product.images &&
                      product.images.map((item, i) => (
                        <img
                          className="CarouselImage"
                          key={item.url}
                          src={item.url}
                          alt={`${i}Slide`}
                        />
                      ))}
                  </Carousel>
                </div>
                <div className=".details">
                  <div className="detailsBlock-1">
                    <h2>{product.name}</h2>
                    <p>Product# {product._id}</p>
                  </div>
                  <div className="detailsBlock-2">
                    <Rating
                      initialValue={product.ratings}
                      readonly={true}
                      transition={true}
                      fillColor="tomato"
                      size={window.innerWidth < 600 ? 14 : 18}
                    />
                    <span>{product.numberOfReviews}Reviews</span>
                  </div>
                  <div className="detailsBlock-3">
                    <h1>{`₹ ${product.price}`}</h1>
                    <div className="detailsBlock-3-1">
                      <div className="detailsBlock-3-1-1">
                        <button
                          disabled={product.stock < 1 ? true : false}
                          onClick={decreaseQuantity}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          disabled={product.stock < 1 ? true : false}
                          onClick={increaseQuantity}
                        >
                          +
                        </button>
                      </div>
                      <button onClick={addToCart}>Add to Cart</button>
                    </div>
                    <p>
                      <b
                        className={
                          product.stock < 1 ? "redColor" : "greenColor"
                        }
                      >
                        {product.stock < 1 ? "Out Of Stock" : "In Stock"}
                      </b>
                    </p>
                  </div>
                  <div className="detailsBlock-4">
                    Description: <p>{product.description}</p>
                  </div>
                  <button className="submitReview" onClick={submitReviewToggle}>
                    Submit Review
                  </button>
                </div>
              </div>

              <h3 className="reviewsHeading">REVIEWS</h3>
              {product.reviews && product.reviews[0] ? (
                <div className="reviews">
                  {product.reviews &&
                    product.reviews.map((review, i) => (
                      <ReviewCard key={i} review={review} />
                    ))}
                </div>
              ) : (
                <p className="noReviews">No Reviews Yet</p>
              )}
              <Dialog open={open} onClose={submitReviewToggle}>
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent>
                  <Rating
                    transition={true}
                    fillColor="tomato"
                    onClick={(e) => setRating(e)}
                    size={window.innerWidth < 600 ? 18 : 25}
                  />
                  <textarea
                    className="submitReviewTextAria"
                    placeholder="Write..."
                    value={comment}
                    cols={60}
                    rows={10}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </DialogContent>
                <DialogActions>
                  <button className="submitReview" onClick={submitReview}>
                    submit
                  </button>
                  <button onClick={submitReviewToggle} className="submitReview">
                    Cancel
                  </button>
                </DialogActions>
              </Dialog>
            </>
          )
        )}
      </div>
    </>
  );
};

export default ProductDetails;
