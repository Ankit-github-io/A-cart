import React from "react";
import Backdrop from "@mui/material/Backdrop";
import "./Header.css";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../../actions/userAction";

const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //function for speed dial
  const logoutUser = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
  };
  const orders = () => {
    navigate("/orders/me");
  };
  const account = () => {
    navigate("/account");
  };
  const dashboard = () => {
    navigate("/admin/dashboard");
  };
  const cart = () => {
    navigate("/cart");
  };
  const actions = [
    { icon: <PersonIcon />, func: account, name: "Profile" },
    { icon: <ListAltIcon />, func: orders, name: "Orders" },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      func: cart,
      name: `Cart ${cartItems.length}`,
    },
    { icon: <ExitToAppIcon />, func: logoutUser, name: "Logout" },
  ];
  if (user && user.role === "admin") {
    actions.unshift({
      icon: <DashboardRoundedIcon />,
      func: dashboard,
      name: "Dashboard",
    });
  }

  return (
    user && (
      <>
        <Backdrop
          open={open}
          onClick={() => setOpen(false)}
          sx={{ zIndex: 12 }}
        />
        <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onClick={() => setOpen(!open)}
          sx={{ zIndex: 13 }}
          open={open}
          direction="down"
          className="speedDial"
          icon={
            <div id="userProfile" className="userProfile">
              <img
                className="speedDialIcon"
                src={user?.avatar.url ? user.avatar.url : "/Profile.png"}
                alt="Profile"
              />
            </div>
          }
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                setOpen(false);
                action.func();
              }}
              tooltipOpen={window.innerWidth <= 600 ? true : false}
            />
          ))}
        </SpeedDial>
      </>
    )
  );
};

export default UserOptions;
