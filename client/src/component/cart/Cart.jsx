import React, { useEffect, useState } from "react";
import "./Cart.css";

import CartItems from "../cart/CartItems.jsx";
import Logo from "../../images/logo/logo-no-bg.png";
import WestSharpIcon from "@mui/icons-material/WestSharp";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("London");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const openContent = (content) => {
    setActiveTab(content);
  };
  //  To Calculate total Price of cartItems  // >> shippingCharges on total price // >> taxCharges on total price
  const itemPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };
  const promoCodeHandel = () => {
    toast.info("Oops Invalid Code");
  };
  const shippingCategories = [
    { name: "Free Shipping", value: 0 },
    { name: "Standard Shipping", value: 50 },
    { name: "Express Shipping", value: 150 },
    { name: "Same-Day Shipping", value: 100 },
    { name: "Overnight Shipping", value: 100 },
  ];
  useEffect(() => {
    setSubtotal(itemPrice + shippingPrice);
  }, [subtotal, itemPrice, shippingPrice]);

  return cartItems && cartItems.length === 0 ? (
    <div className="emptyCart">
      <RemoveShoppingCartIcon />
      <p>Your Cart is Empty</p>
      <Link to={"/products"}>View Products</Link>
    </div>
  ) : (
    <>
      <div className="cartContainer">
        <div className="cartCard">
          <div className="cartCardContainer">
            <div className="cartLogo">
              <div className="svgWrapper">
                <img src={Logo} alt="logo" />
              </div>
              <span style={{ color: "#b5b2abd5", fontSize: "2rem" }}>|</span>
              <span>Your Shopping Cart</span>
            </div>
            <div className="cartProductContainer">
              {cartItems &&
                cartItems.map((item, i) => <CartItems item={item} key={i} />)}
            </div>
            <div className="cartNav">
              <button onClick={() => navigate("/products")}>
                <WestSharpIcon /> Back to Shop
              </button>
              <p>
                Subtotal:
                <span>
                  {subtotal.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>
          <div className="cartCheckOutContainer">
            <div className="checkoutTab">
              <button
                className={
                  activeTab === "London" ? "tabLinks active" : "tabLinks"
                }
                onClick={() => openContent("London")}
              ></button>
              <button
                className={
                  activeTab === "second" ? "tabLinks active" : "tabLinks"
                }
                onClick={() => openContent("second")}
              ></button>
              <button
                className={activeTab === "t" ? "tabLinks active" : "tabLinks"}
                onClick={() => openContent("t")}
              ></button>
            </div>
            <div className="checkoutContent">
              <div className="tabContentContainer">
                <div
                  id="London"
                  className={
                    activeTab === "London" ? "tabContent" : "tabContent hidden"
                  }
                >
                  <h3 className="borderedHeading2">Order Summary</h3>
                  <div>
                    <p>Item {cartItems ? cartItems.length : "0"}</p>
                    <span>
                      {subtotal.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div>
                    <p>Shipping</p>
                    <span>{shippingPrice}</span>
                  </div>
                  <div>
                    <select
                      onChange={(e) =>
                        setShippingPrice(parseInt(e.target.value))
                      }
                    >
                      {shippingCategories.map((items, i) => (
                        <option value={items.value} key={i}>
                          {items.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p>Promo code</p>
                  </div>
                  <div>
                    <input type="text" />
                  </div>
                  <div>
                    <button onClick={() => promoCodeHandel()}>Apply</button>
                  </div>
                </div>
                <div
                  id="second"
                  className={
                    activeTab === "second" ? "tabContent" : "tabContent hidden"
                  }
                >
                  <h3 className="borderedHeading2">Shipping Info</h3>
                  <div>
                    <p>Name</p>
                    <span></span>
                  </div>
                  <div>
                    <p>Address</p>
                  </div>
                </div>
                <div
                  id="t"
                  className={
                    activeTab === "t" ? "tabContent" : "tabContent hidden"
                  }
                >
                  <h3 className="borderedHeading2">Payment Option</h3>
                  <div>
                    <p>UPI</p>
                  </div>
                  <div>
                    <p>Net Banking</p>
                  </div>
                  <div>
                    <p>Credit Card</p>
                  </div>
                  <div>
                    <p>Debit Card</p>
                  </div>
                </div>
              </div>
              <Button
                color="error"
                variant="contained"
                className="checkoutBtn"
                onClick={() => checkoutHandler()}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
