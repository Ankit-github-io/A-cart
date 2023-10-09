const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const app = require("./app");
const connectDataBase = require("./database");

// dotenv Config
dotenv.config();

//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.stack}`);
  console.log(`Shutting down the Server due to Uncaught Exception`);
  process.exit(1);
});

// connect data Base
connectDataBase();

// Add Cloudinary & cloudinary config
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

//unhandled promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
