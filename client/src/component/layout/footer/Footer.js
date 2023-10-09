import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/appstore.png";
import "./Footer.css";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p> Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playStore" />
        <img src={appStore} alt="AppStore" />
      </div>
      <div className="midFooter">
        <h1>Acart</h1>
        <p>High Quality is our first priority</p>
        <p>Copyrights 2023 &copy; Ankit</p>
      </div>
      <div className="rightFooter">
        <a href="https://www.instagram.com/_chocolate_.__/" target="_">
          <span>
            <InstagramIcon />
          </span>
          Instagram
        </a>
        <a href="https://www.facebook.com/MrAnkitProfile" target="_">
          <span>
            <YouTubeIcon />
          </span>
          Youtube
        </a>
        <a href="https://www.facebook.com/MrAnkitProfile" target="_">
          <span>
            <FacebookIcon />
          </span>
          Facebook
        </a>
      </div>
    </footer>
  );
};

export default Footer;
