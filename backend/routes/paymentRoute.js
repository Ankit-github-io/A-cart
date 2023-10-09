const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");

const {
  sendRazorpayApiKey,
  processPayment,
  paymentVerification,
  getAllPayments,
} = require("../controllers/paymentController");

const router = express.Router();

router.route("/razorpayApiKey").get(isAuthenticatedUser, sendRazorpayApiKey);
router.route("/checkout").post(isAuthenticatedUser, processPayment);
router
  .route("/payment/verification")
  .post(isAuthenticatedUser, paymentVerification);
router
  .route("/payments")
  .post(isAuthenticatedUser, authorizeRoles("admin"), getAllPayments);

module.exports = router;
