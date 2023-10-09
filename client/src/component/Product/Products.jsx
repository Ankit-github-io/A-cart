import { Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "./ProductCard";
import Loader from "../layout/loader/Loader";
import { toast } from "react-toastify";
import "./Products.css";
import MetaData from "../layout/MetaData";
import Category from "./Category";
import { Button } from "@mui/material";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [showFilterBox, setShowFilterBox] = useState(false);

  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    loading,
    products,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, priceRange, category, ratings));
  }, [dispatch, keyword, currentPage, priceRange, category, ratings, error]);

  let count = filteredProductsCount;
  return (
    <>
      <MetaData title="PRODUCTS ACart" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="filterToggler">
            <Button
              variant="filledTonal"
              size="small"
              onClick={() => {
                setShowFilterBox((prev) => !prev);
              }}
            >
              <span className="vertical-text">Filter Box </span>
            </Button>
          </div>
          <div className="productsPage">
            <h2 className="productsHeading borderedHeading">Products</h2>
            <div
              className={`filterBoxContainer ${
                showFilterBox ? "showFilterBox" : ""
              }`}
            >
              <form className="filterBox" onSubmit={(e) => e.preventDefault()}>
                <Typography className="borderedHeading">Price</Typography>
                <Slider
                  size="small"
                  value={price}
                  min={0}
                  max={100000}
                  valueLabelDisplay="auto"
                  disableSwap
                  sx={{ color: "tomato" }}
                  getAriaLabel={() => "Temperature range"}
                  onChange={(event, newPrice) => {
                    setPrice(newPrice);
                  }}
                  onChangeCommitted={(e, priceRange) => {
                    setPriceRange(priceRange);
                    setShowFilterBox((prev) => !prev);
                  }}
                />
                <Typography className="borderedHeading">Categories</Typography>
                <Category
                  setCategory={(data) => {
                    setCategory(data);
                    setShowFilterBox((pre) => !pre);
                  }}
                />
                <Typography className="borderedHeading">
                  Ratings Above
                </Typography>
                <Slider
                  value={ratingValue}
                  onChangeCommitted={(e, ratingValue) => {
                    setRatings(ratingValue);
                  }}
                  onChange={(e, newRating) => {
                    setRatingValue(newRating);
                  }}
                  aria-label="Temperature"
                  valueLabelDisplay="auto"
                  marks
                  step={1}
                  min={0}
                  max={5}
                  size="small"
                  sx={{ color: "tomato" }}
                />
              </form>
            </div>
            {products && products.length >= 1 ? (
              <div className="products">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="notFound">Product Not found</p>
            )}

            {resultPerPage < count && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  pageRangeDisplayed={5}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Products;
