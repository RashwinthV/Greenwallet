import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email.trim()) {
      return setStatus({ type: "error", message: "Email is required" });
    }

    try {
      setLoading(true);
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/mail/reset-password`,
        { email }
            );
      
      setStatus({ type: "success", message: res.data.message });
      setTimeout(() => {
        onClose(); 
      }, 2000);
    } catch (error) {
      
      const message =
        error.response?.data?.message || "Something went wrong. Try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <div>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-control mb-10"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ borderColor: "black" }}
        />
      </div>

      {status.message && (
        <div
          className={`mt-2 text-sm ${
            status.type === "error" ? "text-danger" : "text-success"
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary mt-10 w-100"
        style={{ marginTop: "20px" }}
      >
        {loading ? "Sending..." : "Send Reset Password"}
      </button>
    </form>
  );
};

export default ForgotPassword;
