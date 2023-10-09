import React from "react";
import "./Spinner.css";

const Spinner = ({ size }) => {
  let style = {
    width: size || "10px",
    height: size || "10px",
    margin:2*size||"20px"
  };
  return (
    <>
      <div className="spinner" style={style}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Spinner;
