import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { SlMagnifier } from "react-icons/sl";
import "./Search.css";

const Search = () => {
  let navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <>
      <MetaData title="Search-ACart" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          autoFocus
          placeholder="Search a Product..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">
          <SlMagnifier />
          Search
        </button>
      </form>
    </>
  );
};

export default Search;
