import axios from "axios";
import {
  CREATE_ORDER_ID_REQUEST,
  CREATE_ORDER_ID_SUCCESS,
  CREATE_ORDER_ID_FAIL,
  CLEAR_ERRORS,
  PAYMENT_VERIFICATION_REQUEST,
  PAYMENT_VERIFICATION_SUCCESS,
  PAYMENT_VERIFICATION_FAIL,
  GET_RAZORPAY_API_KEY_REQUEST,
  GET_RAZORPAY_API_KEY_SUCCESS,
  GET_RAZORPAY_API_KEY_FAIL,
  LOAD_SCRIPT_REQUEST,
  LOAD_SCRIPT_FAIL,
  LOAD_SCRIPT_SUCCESS,
  SAVE_PAYMENT_REQUEST,
  SAVE_PAYMENT_FAIL,
  SAVE_PAYMENT_SUCCESS,
} from "../constants/paymentConstants";

// Save Payment Details
export const savePaymentDetails = (data) => async (dispatch) => {
  try {
    dispatch({ type: SAVE_PAYMENT_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/payment/success`,
      data,
      config
    );

    dispatch({ type: SAVE_PAYMENT_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: SAVE_PAYMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Payment verification
export const paymentVerification = (option) => async (dispatch) => {
  try {
    dispatch({ type: PAYMENT_VERIFICATION_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/payment/verification`,
      option,
      config
    );
    dispatch({
      type: PAYMENT_VERIFICATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PAYMENT_VERIFICATION_FAIL,
      payload: error.message,
    });
  }
};
//  Load Script for payment
export const loadScript = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_SCRIPT_REQUEST });

    await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });

    dispatch({
      type: LOAD_SCRIPT_SUCCESS,
      payload: true,
    });
  } catch (error) {
    dispatch({
      type: LOAD_SCRIPT_FAIL,
      payload: error.message,
    });
  }
};

// Create Razorpay Order or OrderId

export const createOrderId = (option) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_ID_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const {
      data: { order },
    } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/checkout`,
      option,
      config
    );
    dispatch({
      type: CREATE_ORDER_ID_SUCCESS,
      payload: order,
    });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_ID_FAIL,
      payload: error.message,
    });
  }
};

// getRazorpayKeyApi
export const getRazorpayKeyApi = () => async (dispatch) => {
  try {
    dispatch({ type: GET_RAZORPAY_API_KEY_REQUEST });
    let config = { withCredentials: true };
    const {
      data: { razorpayApiKey },
    } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/razorpayApiKey`,
      config
    );
    dispatch({
      type: GET_RAZORPAY_API_KEY_SUCCESS,
      payload: razorpayApiKey,
    });
  } catch (error) {
    dispatch({
      type: GET_RAZORPAY_API_KEY_FAIL,
      payload: error.message,
    });
  }
};

//  Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
