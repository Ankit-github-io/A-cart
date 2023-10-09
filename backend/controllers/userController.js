const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register A User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  let updateAvatar = {};
  if (
    avatar === "undefined" ||
    avatar === "null" ||
    avatar === undefined ||
    avatar === null ||
    avatar === ""
  ) {
    updateAvatar = null;
  } else {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      transformation: [
        { width: 250, height: 250, gravity: "faces", crop: "thumb" },
      ],
      folder: "avatars",
    });
    updateAvatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: updateAvatar,
  });
  sendToken(user, 201, res);
});

//Login USer
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  // finding user in data base
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

//logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //     "host"
  // )}/api/v1/password/reset/${resetToken}`;
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: `ACart || Your Password Reset Link`,
      html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ACart</title>
  </head>
  <body style="margin: 0">
    <div style="background-color: rgb(36, 33, 37); width: 100%; margin: 0">
      <div style="display: flex; justify-content: space-between; padding: 2rem">
        <img
          src="https://res.cloudinary.com/dhj4i6e2r/image/upload/v1694014380/logo512_sgujji.png"
          alt="ACart"
          style="width: 6rem; height: 6rem"
        />
        <h1
          style="
            font-size: 2rem;
            color: gray;
            font-family: cursive;
            margin: auto;
          "
        >
          Reset Your Password <span style="color: tomato">!</span>
        </h1>
      </div>
      <div style="background-color: #bed3e7; padding: 2rem">
        <h1 style="color: rgb(70, 151, 184)">Password Reset Instructions!</h1>
        <p>Dear ${user.name},</p>
        <p>
          We have received a request to reset your password for your ACart
          account.
        </p>
        <p>
          To complete the password reset process, please follow the steps below:
        </p>
        <ol>
          <li>
            Click on the following link to reset your password:
            <a href="${resetPasswordUrl}">Password Reset Link</a>
          </li>
          <p>
            If the link doesn't work, copy and paste it into your web browser's
            address bar.
          </p>
          <br />
          <li>
            You will be directed to a page where you can create a new password.
            Please choose a strong and unique password for added security.
          </li>
          <br />
          <li>
            Once your new password is set, you will be able to log in to your
            ACart account using your updated credentials.
          </li>
        </ol>
        <p>
          If you did not initiate this password reset request, please disregard
          this email. Your account security is important to us, and your current
          password remains unchanged.
        </p>

        <p>
          Thank you for using ACart. If you have any questions
          or need further assistance, please don't hesitate to contact our
          support team at
          <a href="mailto:${process.env.SMTP_MAIL}">support@acart.com</a>.
        </p>

        <p>Sincerely,<br />The ACart Team</p>
      </div>
    </div>
  </body>
</html>
`,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "For your security, it seems the password reset token is either invalid or has expired.",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(
        "Oops! Looks like the password doesn't match the old one.",
        400
      )
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler(""));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
//Update  User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//Update  User profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      transformation: [
        { width: 250, height: 250, gravity: "faces", crop: "thumb" },
      ],
      folder: "avatars",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});
// Get all user(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// Get Single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id:${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Update  User role--- admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id:${req.params.id}`)
    );
  }
  user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
//delete User ---admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id:${req.params.id}`)
    );
  }
  // remove cloudinary
  if (user) {
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
