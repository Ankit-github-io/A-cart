import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SideBar from "./Sidebar";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import Loader from "../layout/loader/Loader";
import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../actions/userAction";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";
import Spinner from "../layout/loader/Spinner";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    }
    if (!user) {
      dispatch(getUserDetails(userId));
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, navigate, isUpdated, updateError, user, userId]);
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setRole(user.role);
    }
  }, [user]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  return (
    <>
      <MetaData title="Update User" />
      <div className="dashboard">
        <Typography component="h2" className="borderedHeading">
          User Role
        </Typography>
        <SideBar />
        <div className="dashboardContent">
          <div className="newProductContainer">
            {loading ? (
              <Loader />
            ) : (
              <form
                className="createProductForm"
                onSubmit={updateUserSubmitHandler}
              >
                <div className="formInputField">
                  <PersonIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    autoFocus
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="formInputField">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="formInputField">
                  <VerifiedUserIcon />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Choose Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={
                    updateLoading ? true : false || role === "" ? true : false
                  }
                >
                  {updateLoading ? <Spinner size={4} /> : ""} Update
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
