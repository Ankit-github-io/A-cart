const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Contact = require("../models/contactModel");
const sendEmail = require("../utils/sendEmail");

// Create new Contact
exports.newContact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;
  try {
    const contactEntry = new Contact({ name, email, message });
    await contactEntry.validate();
    await contactEntry.save();
  } catch (error) {
    if (error.errors) {
      const errorObject = {};
      Object.keys(error.errors).forEach((key) => {
        errorObject[key] = error.errors[key].message;
      });
      return next(new ErrorHandler(JSON.stringify(errorObject), 400));
    }
  }

  try {
    const formattedMessage = message.replace(/\n/g, "<br>");
    const mailOptions = {
      to: "ankit.murae@gmail.com",
      subject: "Thank You for Contacting Us!",
      html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ACart</title>
  </head>
  <body style="margin: 0">
    <div
      style="
        background-color: rgb(36, 33, 37);
        width: 100%;
        margin: 0;
      "
    >
      <div style="display: flex; justify-content: space-between; padding: 2rem">
        <img
          src="https://res.cloudinary.com/dhj4i6e2r/image/upload/v1694014380/logo512_sgujji.png"
          alt="ACart"
          style="width: 6rem; height: 6rem"
        />
        <h1
          style="font-size: 2rem; color: gray; font-family: Merienda, cursive; margin:auto"
        >
          Message <span style="color: tomato">!</span>
        </h1>
      </div>
      <div style="background-color: #bed3e7; padding: 2rem">
        <h1 style="color: rgb(70, 151, 184)">Thank You for Contacting Us!</h1>
        <p>Dear ${name},</p>
        <p>
          We have received your message and will get back to you as soon as
          possible.
        </p>
        <p>Here are the details of your submission:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Message:</strong>${formattedMessage}</li>
        </ul>
        <p>Thank you for reaching out to us.</p>
        <p>Sincerely,<br />ACart</p>
      </div>
    </div>
  </body>
</html>`,
    };

    await sendEmail(mailOptions);
  } catch (error) {
    return next(new ErrorHandler("Email Not send", 500));
  }
  res.status(201).json({
    success: true,
    message: "Form submitted Successfully",
  });
});
