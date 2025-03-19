import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import translations from "../translation";
import AuthContext from "../context/Authcontextt";

function Login({ language }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/login`,
        { email, password },
        { withCredentials: true } // ✅ Ensure cookies are sent and stored
      );

      const user = res.data.user; // ✅ Get user details from response

      if (res.status === 200) {
        login(user); // ✅ Call login function with user data
        toast.success(translations[language].loginSuccess);
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || translations[language].loginFailed
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-5 shadow-lg"
        style={{ height: "450px", width: "500px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4 text-primary">
          {translations[language].login}
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              {translations[language].email}
            </label>
            <input
              type="email"
              className="form-control rounded-pill p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={translations[language].enterEmail}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              {translations[language].password}
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-start-pill p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={translations[language].enterPassword}
              />
              <button
                type="button"
                className="btn btn-outline-secondary rounded-end-pill"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary w-100 rounded-pill p-2 fs-5"
            type="submit"
          >
            {translations[language].login}
          </button>
        </form>
        <p className="text-center mt-4">
          {translations[language].dontHaveAccount}
          <a
            href="/register"
            className="text-decoration-none text-primary fw-semibold"
          >
            {translations[language].signUp}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
