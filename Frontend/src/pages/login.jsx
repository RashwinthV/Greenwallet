import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import translations from "../translation";

function Login({ language }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/login`,
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      const user = res.data.user;
      localStorage.setItem("userid", user._id);
      localStorage.setItem("role",user.role)

      if (res.status === 200) {
        toast.success(translations[language].loginSuccess);
        navigate("/");
      }
      
    } catch (err) {
      toast.error(err.response?.data?.message || translations[language].loginFailed);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 shadow-lg" style={{ height: "450px", width: "500px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4 text-primary">{translations[language].login}</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">{translations[language].email}</label>
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
            <label className="form-label fw-semibold">{translations[language].password}</label>
            <input
              type="password"
              className="form-control rounded-pill p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={translations[language].enterPassword}
            />
          </div>
          <button className="btn btn-primary w-100 rounded-pill p-2 fs-5" type="submit">
            {translations[language].login}
          </button>
        </form>
        <p className="text-center mt-4">
          {translations[language].dontHaveAccount} 
          <a href="/register" className="text-decoration-none text-primary fw-semibold">
            {translations[language].signUp}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;