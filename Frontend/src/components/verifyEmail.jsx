import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const navigate=useNavigate()

  // Effect to manage the resend OTP timer countdown
  useEffect(() => {
    let timer;
    if (resendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);  // Enable the button when countdown reaches 0
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, resendTimer]);

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("pending");
    setMessage("Verifying OTP...");

    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const user = storedUser ? JSON.parse(storedUser) : null;

      const userId = user?._id || "";
      const email = user.email;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/verify-email/${userId}`,
        { email, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
        localStorage.setItem("user", JSON.stringify({ ...user, emailverified: true })); 
        navigate("/profile")
      } else {
        setStatus("error");
        setMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true); 
    setResendTimer(30); 

    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?._id || "";
      const email = user.email;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/send-verification-email/${userId}`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message || "OTP resent successfully.");
      setStatus("success");
    } catch (error) {
      console.error("Resend error:", error);
      setMessage("Failed to resend OTP. Try again later.");
      setStatus("error");
    }
  };

  return (
    <div className="container text-center mt-5 vh-100">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="mb-3">Verify Your Email</h2>
        <form onSubmit={handleSubmit}>
         

          <div className="mb-3 text-start mt-3">
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <input
              type="text"
              className="form-control"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
 {/* Resend OTP Button - Shows up when timer is expired */}
          <button
            className="btn  w-100 mb-3"
            onClick={handleResendOTP}
            disabled={resendDisabled}
          >
            Resend OTP
            {resendDisabled && ` (in ${resendTimer}s)`}  {/* Shows countdown when disabled */}
          </button>
          {/* Verify Email Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={status === "pending"}
          >
            {status === "pending" ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Status message */}
        {status !== "idle" && (
          <div
            className={`alert mt-3 ${
              status === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        {/* Success Button to redirect to Profile */}
        {status === "success" && (
          <a href="/profile" className="btn btn-success mt-2">
            Go to Profile
          </a>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
