import React from "react";
import "./Header.css";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo/logo-no-bg.png";
import { SlMagnifier, SlBasket } from "react-icons/sl";
import { CgUserlane } from "react-icons/cg";
const Header = () => {
  return (
    <>
      <ReactNavbar
        burgerColor="#ff6347"
        burgerColorHover="crimson"
        navColor1="var(--bg-light-2x)"
        navColor2="var(--bg-light-2x)"
        navColor3="var(--bg-light-2x)"
        navColor4="var(--bg-light-2x)"
        logo={logo}
        logoWidth="7rem"
        logoHeight
        logoHoverSize="4px"
        logoHoverColor="#57b4e0"
        nav1alignItems="center"
        nav2alignItems="center"
        nav3alignItems="center"
        nav4alignItems="center"
        nav1justifyContent="flex-end"
        nav2justifyContent="flex-end"
        nav3justifyContent="flex-start"
        nav4justifyContent="flex-start"
        link1Text="Home"
        link2Text="Products"
        link3Text="Contact"
        link4Text="About"
        link1Url="/"
        link2Url="/products"
        link3Url="/contact"
        link4Url="/about"
        link1Color="var(--font-dark-1x)"
        link1ColorHover="#ff6347"
        link1Margin="1rem"
        link1Family="Merienda"
        link1Size="1rem"
        cartIcon="true"
        searchIcon="true"
        profileIcon="true"
        CartIconElement={SlBasket}
        SearchIconElement={SlMagnifier}
        ProfileIconElement={CgUserlane}
        searchIconSize="1.8rem"
        cartIconSize="1.8rem"
        profileIconSize="2rem"
        searchIconMargin="0"
        cartIconMargin="1rem"
        profileIconMargin="0"
        profileIconUrl="/login"
        searchIconColor="#616060"
        cartIconColor="#616060"
        profileIconColor="tomato"
        searchIconColorHover="crimson"
        cartIconColorHover="crimson"
        profileIconColorHover="crimson"
      />
    </>
  );
};

export default Header;
