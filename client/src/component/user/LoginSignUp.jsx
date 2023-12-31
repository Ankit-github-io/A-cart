import React, { useEffect, useRef, useState } from "react";
import "./LoginSignUp.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { CgUserlane } from "react-icons/cg";
import { login, register, clearErrors } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/loader/Loader";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const LoginSignUp = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  const [passwordShown, setPasswordShown] = useState(false);

  const { name, email, password } = user;

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };
  const registerSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  const redirect = location.search ? location.search.split("=")[1] : "/account";
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, navigate, redirect, isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="loginSignUpContainer">
          <div className="loginSignUpBox">
            <div>
              <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
              </div>
              <button className="switchBtn" ref={switcherTab}></button>
            </div>
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="loginEmail">
                <MailOutlinedIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  autoFocus
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <LockOpenOutlinedIcon />
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button onClick={(e) => togglePasswordVisibility(e)}>
                  {passwordShown ? (
                    <VisibilityOutlinedIcon />
                  ) : (
                    <VisibilityOffOutlinedIcon />
                  )}
                </button>
              </div>
              <Link to="/password/forgot">Forget Password ?</Link>
              <input type="submit" value="Login" className="loginBtn" />
            </form>
            <form
              className="signUpForm"
              ref={registerTab}
              onSubmit={registerSubmit}
            >
              <div className="signUpName">
                <CgUserlane />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  autoFocus
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpEmail">
                <MailOutlinedIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpPassword">
                <LockOpenOutlinedIcon />
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
                <button onClick={(e) => togglePasswordVisibility(e)}>
                  {passwordShown ? (
                    <VisibilityOutlinedIcon />
                  ) : (
                    <VisibilityOffOutlinedIcon />
                  )}
                </button>
              </div>
              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>
              <input type="submit" value="Register" className="signUpBtn" />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignUp;
