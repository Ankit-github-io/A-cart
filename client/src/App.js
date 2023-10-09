import "./App.css";
import Header from "./component/layout/header/Header.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WebFont from "webfontloader";
import React, { useEffect, useState } from "react";
import Footer from "./component/layout/footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/user/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/header/UserOptions";
import Profile from "./component/user/Profile";
import UpdateProfile from "./component/user/UpdateProfile";
import UpdatePassword from "./component/user/UpdatePassword";
import ForgotPassword from "./component/user/ForgotPassword";
import ResetPassword from "./component/user/ResetPassword";
import Cart from "./component/cart/Cart.jsx";
import ShippingInfo from "./component/order/Shipping";
import ConfirmOrder from "./component/order/ConfirmOrder";
import Payment from "./component/order/Payment";
import axios from "axios";
import MyOrders from "./component/order/MyOrders";
import OrderDetails from "./component/order/OrderDetails";
import Dashboard from "./component/admin/Dashboard";
import ProductList from "./component/admin/ProductList";
import NewProduct from "./component/admin/NewProduct";
import UpdateProduct from "./component/admin/UpdateProduct";
import OrderList from "./component/admin/OrderList";
import UpdateOrder from "./component/admin/UpdateOrder";
import UserList from "./component/admin/UsersList";
import UpdateUser from "./component/admin/UpdateUser";
import ProductReviews from "./component/admin/ProductReviews";
import ContactUs from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import { ToastContainer } from "react-toastify";
import NotFound from "./component/layout/NotFound/NotFound";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [razorpayApiKey, setRazorpayApiKey] = useState("");

  // for protected Route
  const Private = ({ Component, ...rest }) => {
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
  };

  // For Admin Route
  const Admin = ({ Component, ...rest }) => {
    return user && user.role === "admin" ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/login" />
    );
  };

  const fetchRazorpayApiKey = async () => {
    try {
      let config = { withCredentials: true };
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/razorpayApiKey`,
        config
      );
      setRazorpayApiKey(res.data.razorpayApiKey);
    } catch (error) {
      if (error.response && error.response.status === 401) {
      } else {
        console.error("Error:", error);
      }
    }
  };

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Merienda", "Roboto"],
      },
    });
    store.dispatch(loadUser());
    fetchRazorpayApiKey();
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center" />
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Private Component={Profile} />} />
        <Route
          path="/me/update"
          element={<Private Component={UpdateProfile} />}
        />
        <Route
          path="/password/update"
          element={<Private Component={UpdatePassword} />}
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" Component={Cart} />
        <Route
          path="/login/shipping"
          element={<Private Component={ShippingInfo} />}
        />
        <Route
          path="/order/confirm"
          element={<Private Component={ConfirmOrder} />}
        />
        <Route
          path="/process/payment"
          element={
            <Private Component={Payment} razorpayApiKey={razorpayApiKey} />
          }
        />
        <Route path="/orders/me" element={<Private Component={MyOrders} />} />
        <Route
          path="/order/:id"
          element={<Private Component={OrderDetails} />}
        />
        <Route
          path="/admin/dashboard"
          element={<Admin Component={Dashboard} />}
        />
        <Route
          path="/admin/products"
          element={<Admin Component={ProductList} />}
        />
        <Route
          path="/admin/product"
          element={<Admin Component={NewProduct} />}
        />
        <Route
          path="/admin/product/:id"
          element={<Admin Component={UpdateProduct} />}
        />
        <Route path="/admin/orders" element={<Admin Component={OrderList} />} />
        <Route
          path="/admin/order/:id"
          element={<Admin Component={UpdateOrder} />}
        />
        <Route path="/admin/users" element={<Admin Component={UserList} />} />
        <Route
          path="/admin/user/:id"
          element={<Admin Component={UpdateUser} />}
        />
        <Route
          path="/admin/reviews"
          element={<Admin Component={ProductReviews} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
