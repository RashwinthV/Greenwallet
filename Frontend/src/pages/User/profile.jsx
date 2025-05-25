import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Password from "../../components/Password/newPassword";
import translation from "../../translation";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const language = localStorage.getItem("language");

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
      const userId = user._id;

      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/user/mail/send-verification-email/${userId}`,
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Verification email sent!");
        navigate("/verify-email");
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
      // <div className="d-flex justify-content-center align-items-center vh-100">
      //   <div className="spinner-border text-primary" role="status"></div>
      // </div>
      <>
      <div>hai </div></>
    );
  }

  return (
    <div className="container mt-4 mb-5 ">
      <h2 className="mb-4 text-center">User Profile</h2>
      <div className="card shadow-lg p-4 border-0 rounded-3">
        <div className="card-body">
          {/* Name */}
          <div className="row mb-3">
            <div className="col-12 d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold">{translation[language].name} :</span>
              <span>{user.name}</span>
            </div>
          </div>

          {/* Email */}
          <div className="row mb-3">
            <div className="col-12 d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold">{translation[language].email} : </span>
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

          {/* Email Verified Status */}
          <div className="row mb-3">
          <div className="col-12 d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-bold">{translation[language]?.EmailVerified} : {" "} </span>
              {user?.emailverified ? (
                <span className="text-success fw-bold mx-2">
                  {translation[language]?.yes}
                </span>
              ) : (
                <span className="text-danger fw-bold mx-2">{translation[language]?.no}</span>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="row mb-3">
            <div className="col-12 d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold">
                {translation[language].phoneNo} : {" "}
              </span>
              <span> {user.phoneNo} </span>
            </div>
          </div>

          {/* Age */}
          <div className="row mb-3">
            <div className="col-12 d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold"> {translation[language].age} : </span>
              <span> {user.age} </span>
            </div>
          </div>

          {/* Gender */}
          <div className="row mb-3">
            <div className="col-12 d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold"> {translation[language].gender} : </span>
              <span> {user.gender}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="mt-4">
        <Password />
      </div>
    </div>
  );
};

export default Profile;
