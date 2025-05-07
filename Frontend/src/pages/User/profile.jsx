import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleVerifyEmail = async () => {
    setVerifying(true);
    try {
      const token = localStorage.getItem("token");
      const userId=user._id;
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/mail/send-verification-email/${userId}`,
        {email: user.email},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Verification email sent!");
        navigate("/verify-email")

      } else {
        toast.error("Failed to send verification email");
      }
    } catch (err) {
      toast.error("Error sending verification email");
    } finally {
      setVerifying(false);
    }
  };
  

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
<div className="container mt-4 vh-100">
<h2 className="mb-4">User Profile</h2>
      <div className="card shadow-sm p-4">
        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Name:</div>
          <div className="col-sm-8">{user.name}</div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Email:</div>
          <div className="col-sm-8 d-flex align-items-center justify-content-between">
            <span>{user.email}</span>
            {!user.emailverified && (
              <button
                className="btn btn-sm btn-outline-success"
                onClick={handleVerifyEmail}
                disabled={verifying}
              >
                {verifying ? "Sending..." : "Verify Email"}
              </button>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Phone Number:</div>
          <div className="col-sm-8">{user.phoneNo}</div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Age:</div>
          <div className="col-sm-8">{user.age}</div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Gender:</div>
          <div className="col-sm-8 text-capitalize">{user.gender}</div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Email Verified:</div>
          <div className="col-sm-8">
            {user.emailverified ? (
              <span className="text-success">Yes</span>
            ) : (
              <span className="text-danger">No</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
