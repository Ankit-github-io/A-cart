import React, { useEffect, useRef, useState } from "react";
import "./Payment.css";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "../cart/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo192.png";
import axios from "axios";
import AlarmOffIcon from "@mui/icons-material/AlarmOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";
import { createOrder } from "../../actions/orderAction";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = ({ razorpayApiKey }) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const razorpayRef = useRef();
  const [activeStep, setActiveStep] = useState(1);

  const { amount, id } = orderInfo.paymentInfo;
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    itemsPrice,
    taxPrice,
    shippingPrice,
  } = orderInfo;

  const handlePaymentFailed = (response) => {
    toast.error(response.error.reason);
  };
  const handlePayButton = async function () {
    const razorpay = razorpayRef.current;
    if (razorpay) {
      razorpay.on("payment.failed", handlePaymentFailed);
      razorpay.open();
    }
  };
  const onPaymentSuccess = async (res) => {
    setActiveStep(2);

    let data = {
      order_id: id,
      razorpay_payment_id: res.razorpay_payment_id,
      razorpay_signature: res.razorpay_signature,
    };
    let config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/payment/verification`,
      data,
      config
    );
    result.data.success
      ? toast.success("Payment Successful")
      : toast.error(result.data.message);
    if (result.data.success) {
      let data = {
        shippingInfo,
        paymentInfo: {
          id: res.razorpay_payment_id,
          order_id: res.order_id,
          status: "paid",
        },
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
      dispatch(createOrder(data));
    }
  };

  useEffect(() => {
    const options = {
      key: razorpayApiKey,
      amount: amount,
      currency: "INR",
      name: "ACart",
      description: "Test Transaction",
      image: logo,
      order_id: id,
      handler: function (response) {
        onPaymentSuccess(response);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: shippingInfo.phoneNo,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#cf4c35",
      },
      modal: {
        backdropclose: false,
        escape: true,
        handleback: true,
        confirm_close: false,
        animation: true,
      },
      timeout: 3 * 60,
      send_sms_hash: true,
      max_count: 4,
    };
    const razorpay = new window.Razorpay(options);
    razorpayRef.current = razorpay;
    razorpay.on("payment.failed", function (response) {
      handlePaymentFailed(response);
    });
    razorpay.open();
  }, []);

  return (
    <>
      <MetaData title="Payment" />
      <div className="paymentContainer">
        <div className="stepper">
          <CheckoutSteps activeStep={activeStep} />
        </div>
        {activeStep === 2 ? (
          <>
            <div className="orderSuccess">
              <CheckCircleIcon />

              <Typography>Your Order has been Placed successfully </Typography>
              <Link to="/orders/me">View Orders</Link>
            </div>
          </>
        ) : (
          <>
            <div className="orderSuccess">
              <AlarmOffIcon />
              <Typography>Payment TimeOut! Try Again.</Typography>
            </div>
            <div className="payBtn">
              <button id="rzp-button1" onClick={handlePayButton}>
                {`Pay ${orderInfo.totalPrice}`}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Payment;
