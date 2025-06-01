import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ModalWrapper from "../comp/models/wrapper";
import ForgotPassword from "../comp/Password/Forgerpassword";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/login`,
        { email, password },
        { withCredentials: true }
      );

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      if (res.status === 200) {
        toast.success("Login successful!");
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light px-3">
      <div
        className="card shadow-lg w-100"
        style={{
          maxWidth: "400px",
          borderRadius: "12px",
        }}
      >
        <div className="card-body p-4 p-sm-5">
          <h3 className="text-center mb-4 text-primary">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control rounded-pill p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-start-pill p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-end-pill"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="text-end mt-2">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary w-100 rounded-pill p-2 fs-5"
              type="submit"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none text-primary fw-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <ModalWrapper show={showForgotModal} onClose={() => setShowForgotModal(false)}>
        <ForgotPassword onClose={() => setShowForgotModal(false)} />
      </ModalWrapper>
    </div>
  );
}

export default Login;
