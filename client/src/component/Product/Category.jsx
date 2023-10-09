import React from "react";
import "./Category.css";
const Category = ({ setCategory }) => {
  const categories = [
    "Laptop",
    "Smartphone",
    "Electronics",
    "Cloths",
    "Home",
    "Beauty",
    "Toys",
    "Health",
    "Groceries",
    "Bags",
    "Shoes",
    "Accessories",
    "Art",
    "Kitchen",
    "Tools",
    "Gifts",
    "Stationery",
    "Watches",
    "Fitness",
    "Outdoor",
    "VideoGames",
    "Cameras",
    "Travel",
    "Phones",
    "Computers",
    "Drones",
    "DIY",
    "Party",
    "Costumes",
    "HomeDecor",
    "Cookware",
    "Sunglasses",
    "BoardGames",
    "Skincare",
    "Perfumes",
    "Grooming",
    "Luggage",
    "Candles",
    "Swimwear",
    "Tea",
    "Coffee",
    "Cooking",
    "Birthday",
    "Anniversary",
  ];

  return (
    <ul className="scrollbar categoryUl">
      <li className="category-link" onClick={() => setCategory("")}>
        All
      </li>
      {categories.map((category) => (
        <li
          className="category-link"
          key={category}
          onClick={() => setCategory(category)}
        >
          {category}
        </li>
      ))}
    </ul>
  );
};

export default Category;
