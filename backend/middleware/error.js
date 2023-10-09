const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Product Id in mongodb  Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000 || 11000 === err.code) {
    const message = `Duplicate ${Object.keys(err.keyValue)}Entered`;
    err = new ErrorHandler(message, 400);
  }
  //
  // wrong Json web token error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid,try Again`;
    err = new ErrorHandler(message, 400);
  }
  // JWT Expire  error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is Expired,try Again`;
    err = new ErrorHandler(message, 400);
  }
  // MongoDB timeout error
  if (
    err.message &&
    err.message.includes("buffering timed out after 10000ms")
  ) {
    const message = `Please try again later`;
    err = new ErrorHandler(message, 500); // Set status code as per your requirement
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
