import React from "react";

const LoginLoader = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#eafaf1", color: "#2e7d32" }}
    >
      <div
        className="spinner-border text-success mb-4"
        role="status"
        style={{ width: "3rem", height: "3rem", borderWidth: "0.3em" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h5 className="text-center fw-semibold" style={{ fontSize: "1.2rem" }}>
        Logging you in... <br /> Please wait.
      </h5>
    </div>
  );
};

export default LoginLoader;
