import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Header.css";

const Header = ({ language, setLanguage }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("user"));

  const texts = {
    en: {
      admin: "Admin Panel",
      home: "Home",
      records: "Records",
      entry: "Entry",
      signup: "Sign Up",
      login: "Login",
      logout: "Logout",
      language: "Language",
    },
    ta: {
      admin: "நிர்வாக குழு",
      home: "முகப்பு",
      records: "பதிவுகள்",
      entry: "நுழைவு",
      signup: "பதிவு செய்யவும்",
      login: "உள்நுழைவு",
      logout: "வெளியேறுதல்",
      language: "மொழி",
    },
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || "";

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) setLanguage(savedLanguage);
  }, [setLanguage]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setIsNavbarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
    document.getElementById("navbarNav")?.classList.remove("show");
  };

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-none d-md-flex">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Green Wallet
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isNavbarOpen}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto gap-3">
              <p className="nav-item nav-link mt-1 mb-0">
                Welcome {user ? user.name : "Guest"}
              </p>
              {role === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/Admin" onClick={closeNavbar}>
                    {texts[language].admin}
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeNavbar}>
                  {texts[language].home}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/records" onClick={closeNavbar}>
                  {texts[language].records}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/entry" onClick={closeNavbar}>
                  {texts[language].entry}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/analysis" onClick={closeNavbar}>
                  {texts[language].analysis || "Analysis"}
                </Link>
              </li>

              {isLoggedIn ? (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    {texts[language].logout}
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar}>
                    {texts[language].login}
                  </Link>
                </li>
              )}
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {texts[language].language}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="languageDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleLanguageChange("en")}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleLanguageChange("ta")}
                    >
                      தமிழ்
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar (only welcome and language) */}
      <div className="d-flex d-md-none justify-content-between align-items-center bg-dark text-white px-3 py-2">
        <span className="fw-semibold">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Green Wallet
          </Link>{" "}
        </span>
        <div className="d-flex align-items-center gap-2">
          {/* Language Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-light btn-sm dropdown-toggle"
              type="button"
              id="languageDropdownMobile"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {texts[language].language}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="languageDropdownMobile"
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("en")}
                >
                  English
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("ta")}
                >
                  தமிழ்
                </button>
              </li>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-light btn-sm dropdown-toggle"
              type="button"
              id="profileDropdownMobile"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle fs-5"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="profileDropdownMobile"
            >
              {isLoggedIn ? (
                <>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      {" "}
                      <i className="bi bi-person-circle fs-5 mx-2"></i>
                      {user ? user.name : "Guest"}{" "}
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      {" "}
                      <i className="bi bi-box-arrow-in-right fs-4 mx-1"></i>
                      {texts[language].logout}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link className="dropdown-item" to="/login">
                    {texts[language].login}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="d-md-none d-flex fixed-bottom justify-content-around  bg-dark py-2 text-white shadow border-top">
        <Link to="/" className="text-white text-center">
          <i className="bi bi-house fs-4"></i>
        </Link>
        <Link to="/records" className="text-white text-center">
          <i className="bi bi-card-list fs-4"></i>
        </Link>
        <Link to="/entry" className="text-white text-center">
          <i className="bi bi-pencil-square fs-4"></i>
        </Link>
        <Link to="/analysis" className="text-white text-center">
          <i className="bi bi-graph-up fs-4"></i>
        </Link>
      </nav>
    </>
  );
};

export default Header;
