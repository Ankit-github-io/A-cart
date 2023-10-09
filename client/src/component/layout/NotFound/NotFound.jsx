import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import "./NotFound.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <ErrorIcon />
      <h1>404</h1>
      <h2>We are Sorry! Page Not Found</h2>
      <Typography>
        The page you are looking for might have been removed had its name change
        or It's temporary unavailable
      </Typography>
      <Link to="/">Back To Home</Link>
    </div>
  );
};

export default NotFound;
