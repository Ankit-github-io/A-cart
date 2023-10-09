import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "../Product/ProductCard";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/Loader";
import { toast } from "react-toastify";
const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error]);
  return (
    <>
      <MetaData title="ACart" />
      <div className="banner">
        <p>
          Shop <span> Smart </span> Shop
          <span> Stylish </span>
        </p>
        <p>
          Welcome to
          <span> ACart</span>
        </p>
        <a href="#Products">
          <button className="water-drop">
            Scroll <CgMouse />
          </button>
        </a>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="productContainer" id="Products">
          {products ? (
            products.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))
          ) : (
            <p>Check Your Network Connection</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
