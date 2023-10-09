import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

const PayButton = () => {
  const [razorpayApiKey, setRazorpayApiKey] = useState("");
  const handlePayment = () => {
    var options = {
      key: "YOUR_KEY_ID",
      amount: "50000",
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: "order_9A33XWu170gUtm",
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };
  useEffect(() => {
    const fetchRazorpayApiKey = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/razorpayApiKey`
      );
      setRazorpayApiKey(res.data.razorpayApiKey);
    };

    fetchRazorpayApiKey();
  }, []);

  // ...

  return (
    <>
      <button id="rzp-button1" onClick={handlePayment}>
        Pay
      </button>
      <Helmet>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Helmet>
    </>
  );
};

export default PayButton;
