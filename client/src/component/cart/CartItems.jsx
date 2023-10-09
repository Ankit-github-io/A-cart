import React from "react";
import "./Cart.css";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { useDispatch } from "react-redux";
import {
  AddCircleOutlineRounded,
  RemoveCircleOutlineRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
const CartItems = ({ item }) => {
  const dispatch = useDispatch();

  const increaseQuantity = (id, quantity, stock) => {
    let newQty = quantity + 1;
    if (quantity >= stock) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };
  const decreaseQuantity = (id, quantity) => {
    let newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };
  const removeFromCart = (id) => {
    dispatch(removeItemsFromCart(id));
  };
  return (
    <>
      <div className="cartProduct" key={item.product}>
        <div className="productInfo">
          <img src={item.image} alt="Product" height={"auto"} width={100} />
          <div className="productNameWrapper">
            <p>
              {item.name}
              <br />
              <span>{item.product}</span>
            </p>
          </div>
          <div className="quantityBtn">
            <>
              <Button
                color="error"
                onClick={() =>
                  increaseQuantity(item.product, item.quantity, item.stock)
                }
              >
                <AddCircleOutlineRounded />
              </Button>
              <p>{item.quantity}</p>
              <Button
                color="error"
                onClick={() => decreaseQuantity(item.product, item.quantity)}
              >
                <RemoveCircleOutlineRounded />
              </Button>
            </>
          </div>
          <p>
            {(item.quantity * item.price).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </p>
        </div>
        <button
          className="removeCartItemBtn"
          onClick={() => removeFromCart(item.product)}
        >
          <ClearSharpIcon />
        </button>
      </div>
    </>
  );
};

export default CartItems;
