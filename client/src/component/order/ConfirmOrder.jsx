import React, { useState } from "react";
import "./ConfirmOrder.css";
import CheckoutSteps from "../cart/CheckoutSteps.jsx";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "axios";

import { toast } from "react-toastify";
import Spinner from "../layout/loader/Spinner";
import { Button } from "@mui/material";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const [loadingConfirmOrder, setLoadingConfirmOrder] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { shippingInfo } = useSelector((state) => state.shippingInfo);

  //  To Calculate total Price of cartItems  // >> shippingCharges on total price // >> taxCharges on total price
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const handleConfirmOrderBtn = async () => {
    setLoadingConfirmOrder((pre) => !pre);
    // Store Order info
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/checkout`,
      { amount: totalPrice },
      config
    );
    if (data) {
      let option = {
        shippingInfo,
        orderItems: cartItems,
        paymentInfo: data.order,
        itemsPrice: subtotal, // total price of all item
        taxPrice: tax,
        shippingPrice: shippingCharges,
        totalPrice, // total price  including tax and shipping charges
      };
      sessionStorage.setItem("orderInfo", JSON.stringify(option));
      navigate("/process/payment");
      setLoadingConfirmOrder((pre) => !pre);
    } else {
      toast.error("something Wrong please try Again");
    }
  };
  return (
    <>
      <MetaData title="Confirm Order" />
      <div className="confirmOrderPage">
        <div className="stepper">
          <CheckoutSteps activeStep={1} />
        </div>
        <div className="confirmOrderContainer">
          <div className="confirmOrderLeft">
            <div className="confirmShippingArea">
              <Typography>Shipping Info</Typography>
              <div className="confirmShippingAreaBox">
                <div>
                  <p>Name:</p>
                  <span>{user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{shippingInfo.phoneNo}</span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>{address}</span>
                </div>
              </div>
            </div>
            <div className="confirmCartItems">
              <Typography>Your Cart Items:</Typography>
              <div className="confirmCartItemsContainer">
                {cartItems &&
                  cartItems.map((item, i) => (
                    <div key={i}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <span>
                        {item.quantity} X ₹{item.price} =
                        <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="confirmOrderRight">
            <div className="orderSummary">
              <Typography>Order Summery</Typography>
              <div>
                <div>
                  <p>Subtotal:</p>
                  <span>
                    {subtotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
                <div>
                  <p>Shipping Charges:</p>
                  <span>₹{shippingCharges}</span>
                </div>
                <div>
                  <p>GST:</p>
                  <span>
                    {tax.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
              </div>

              <div className="orderSummaryTotal">
                <p>
                  <b>Total:</b>
                </p>
                <span>
                  {totalPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>

              <Button onClick={handleConfirmOrderBtn}>
                {loadingConfirmOrder ? <Spinner size={4} /> : ""}Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
