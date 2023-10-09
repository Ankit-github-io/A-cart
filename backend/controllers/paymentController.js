const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Get All Payments
exports.getAllPayments = catchAsyncErrors(async (req, res, next) => {
  let { from, to } = req.body;
  const allPayments = await instance.payments.all({ from: from, to: to });
  if (!allPayments) {
    return next(new ErrorHandler("No payment details found", 404));
  }
  if (allPayments.length() === 0) {
    return next(new ErrorHandler("Your Payment List Empty", 204));
  }
  res.status(200).json({
    success: true,
    allPayments,
  });
});
// Create Order For every Payment
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { amount, receipt } = req.body;
  const order = await instance.orders.create({
    amount: Number(amount * 100), // amount in the smallest currency unit
    currency: "INR",
    receipt: receipt,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

exports.paymentVerification = catchAsyncErrors(async (req, res, next) => {
  const {
    order_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;
  let secret = process.env.RAZORPAY_API_SECRET;
  function verifyPaymentSignature(
    orderId,
    paymentId,
    razorpaySignature,
    KeySecret
  ) {
    const generatedSignature = crypto
      .createHmac("sha256", KeySecret)
      .update(orderId + "|" + paymentId)
      .digest("hex");
    return generatedSignature === razorpaySignature;
  }
  const isSignatureValid = verifyPaymentSignature(
    order_id,
    razorpay_payment_id,
    razorpay_signature,
    secret
  );

  if (isSignatureValid) {
    res.status(200).json({
      success: true,
      message: `Payment Signature is valid`,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid Payment" });
  }
});

exports.sendRazorpayApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ razorpayApiKey: process.env.RAZORPAY_API_KEY });
});
