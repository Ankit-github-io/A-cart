import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/Loader";
import "./Profile.css";
import "../layout/About/imgCircle.css";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {user && (
            <>
              <MetaData title={`${user.name}'s Profile`} />
              <div className="profileContainer">
                <div>
                  <h1>My profile</h1>
                  <div className="ProfilePIC">
                    <img
                      src={user.avatar?.url ? user.avatar.url : "/Profile.png"}
                      alt={user.name}
                    />
                  </div>
                  <Link to="/me/update">Edit Profile</Link>
                </div>
                <div>
                  <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substr(0, 10)}</p>
                  </div>
                  <div>
                    <Link to="/orders/me">My Orders</Link>
                    <Link to="/password/update">Change Password</Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Profile;
