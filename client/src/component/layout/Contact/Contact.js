import React, { useState } from "react";
import "./Contact.css";
import { Button } from "@mui/material";
import Helmet from "react-helmet";
import {
  SlSocialFacebook,
  SlSocialGithub,
  SlSocialInstagram,
  SlSocialLinkedin,
} from "react-icons/sl";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../loader/Spinner";
import { Dialog, DialogContent } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, message };
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/contact/new`,
        formData
      );
      if (!res) {
        toast.info("Try Again!");
      }
      setLoading(false);
      modelToggle();
      setEmail("");
      setName("");
      setMessage("");
    } catch (error) {
      setLoading(false);
      let errorObj = JSON.parse(error.response.data.message);
      for (const key in errorObj) {
        if (errorObj.hasOwnProperty(key)) {
          toast.error(errorObj[key]);
        }
      }
    }
  };
  const modelToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  return (
    <>
      <Helmet title="Contact-ACart" />
      <div className="contactsPage">
        <h2 className="ContactsHeading borderedHeading">Contacts</h2>
        <div className="contactContainer">
          <div className="contactContent">
            <p>Getting in touch is easy!</p>
            <a href="mailto:ankit.murae@gmail.com">ankit.murae@gmail.com</a>
            <a href="tel:+917348416096">Call Us: +91 73484-16096</a>
            <a href="#contactOption"> Find us Here!</a>
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
          <div className="contactForm">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                placeholder="Your Name"
                required
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                value={email}
                placeholder="Your Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                value={message}
                required
                placeholder="Write us about any project.We'd love to work with you!"
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="outlined" type="submit">
                {loading ? (
                  <>
                    <Spinner size={4} />
                    Sending
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
            <Dialog open={open} onClose={modelToggle}>
              <DialogContent className="contactModel">
                <div className="modelContent">
                  <h1>Thank You for Contacting us!</h1>
                  <span>
                    We appreciate your interest and will get back to you as soon
                    as possible.
                  </span>
                  <p>
                    If you have any further questions, feel free to reach out to
                    us.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
