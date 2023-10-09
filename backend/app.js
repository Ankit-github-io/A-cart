const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
const maxUploadSize = 50 * 1024 * 1024; // 50MB
app.use(bodyParser.urlencoded({ extended: true, limit: maxUploadSize })); // Body-parser middleware to handle URL-encoded data
app.use(fileUpload());
app.use(bodyParser.json({ limit: maxUploadSize })); // Body-parser middleware to handle JSON data
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

// cors allowed for specific

app.use(cors({ origin: "https://shopacart.onrender.com", credentials: true }));

// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const contactRoute = require("./routes/contactRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", contactRoute);

// Middleware for error
app.use(errorMiddleware);

// RazorPay Credential
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

module.exports = app;
