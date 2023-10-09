import React from "react";
import "./aboutSection.css";
import "./imgCircle.css";
import { Typography } from "@mui/material";
import {
  SlSocialFacebook,
  SlSocialGithub,
  SlSocialInstagram,
  SlSocialLinkedin,
} from "react-icons/sl";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div className="aboutSection">
      <div className="aboutSectionContainer">
        <Typography component="h1">About me</Typography>
        <div>
          <div className="aboutSectionContainer1">
            <div id="wrap" className="img-wrap">
              <img
                src="https://res.cloudinary.com/dhj4i6e2r/image/upload/v1693921573/myPic.jpg"
                alt="Founder"
              />
            </div>
            <Typography component="h3">Ankit Maurya</Typography>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h3">
              Developer<span> & Designer</span>
            </Typography>
            <Typography>
              Hi, I'm a FullStack Developer with a passion for creating awesome
              web applications that people love to use. I'm equally comfortable
              leading front-end and back-end development, and I take pride in
              delivering high-quality code that exceeds your expectations.
              Whether you're a startup or an established business, I'm excited
              to work with you to create a web app that's not only functional
              but also fun and engaging.
            </Typography>
            <div className="contactIcon" id="contactOption">
              <Link to="https://github.com/Ankit-github-io">
                <SlSocialGithub />
              </Link>
              <Link to="https://www.linkedin.com/in/ankit-maurya-988793274">
                <SlSocialLinkedin />
              </Link>
              <Link to="https://www.instagram.com/_chocolate_.__/">
                <SlSocialInstagram />
              </Link>
              <Link to="https://www.facebook.com/MrAnkitPeofile">
                <SlSocialFacebook />
              </Link>
            </div>
          </div>
        </div>
        <Typography component="p" className="bottomSpan">
          This is E-commerce website made by Ankit Maurya.
        </Typography>
      </div>
    </div>
  );
};

export default About;
