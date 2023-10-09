const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxLength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    maxLength: [100, "Email cannot exceed 100 characters"],
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid Email"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    maxLength: [3000, "Message cannot exceed 3000 characters"],
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
