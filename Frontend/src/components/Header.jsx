import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MdAdminPanelSettings } from "react-icons/md";
import "../styles/Header.css";
import translations from "../translation";
import axios from "axios";

const Header = ({ language, setLanguage, user, logout }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [notification, setnotification] = useState(false);

  const texts = {
    en: {
      admin: "Admin",
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/notifications/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setnotification(true);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setIsNavbarOpen(false);
  };

  const handleLogout = () => {
    logout();
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

          <div className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3">
              {user?.role === "admin" && (
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
                  {translations[language].analysis}
                </Link>
              </li>

              {user ? (
                <>
                  <li className="d-flex align-items-center">
                    <Link
                      className="nav-item d-flex align-items-center"
                      style={{ textDecoration: "none", color: "grey" }}
                      to="/profile"
                    >
                      <i className="bi bi-person-circle fs-5 mx-2"></i>
                      Profile
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                      {texts[language].logout}
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar}>
                    {texts[language].login}
                  </Link>
                </li>
              )}

              {/* Language Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    width="30"
                    height="30"
                    src="https://img.icons8.com/nolan/64/google-translate.png"
                    alt="google-translate"
                  />
                </button>
                <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => handleLanguageChange("en")}>
                      English
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleLanguageChange("ta")}>
                      தமிழ்
                    </button>
                  </li>
                </ul>
              </li>

              {/* Notification with bell + label + red dot */}
              <li className="nav-item position-relative">
                <Link
                  to="/notification"
                  className="nav-link d-flex align-items-center gap-2 position-relative"
                  style={{ textDecoration: "none", color: "grey" }}
                >
                  <div className="position-relative">
                    <i className="bi bi-bell fs-4"></i>
                    {notification && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ zIndex: 1 }}
                      ></span>
                    )}
                  </div>
                  <span>{translations[language].Notifiations}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="d-flex d-md-none justify-content-between align-items-center bg-dark text-white px-3 py-2">
        <span className="fw-semibold">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Green Wallet
          </Link>
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
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/nolan/64/google-translate.png"
                alt="google-translate"
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdownMobile">
              <li>
                <button className="dropdown-item" onClick={() => handleLanguageChange("en")}>
                  English
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => handleLanguageChange("ta")}>
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
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdownMobile">
              {user?.role === "admin" && (
                <li className="nav-item d-flex align-items-center">
                  <Link className="nav-link mx-4 d-flex align-items-center" to="/Admin" onClick={closeNavbar}>
                    <MdAdminPanelSettings size={24} color="blue" className="me-2" />
                    <span>{texts[language].admin}</span>
                  </Link>
                </li>
              )}
              {user ? (
                <>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-circle fs-5 mx-2"></i>
                      {user.name}
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
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
              <li className="nav-item position-relative">
                <Link
                  to="/notification"
                  className="dropdown-item d-flex align-items-center gap-2 position-relative"
                  style={{ paddingRight: "2rem" }}
                > {notification && (
                    <span
                      className="position-absolute top-0 mx-3 my-2 translate-middle p-1 bg-danger border border-light rounded-circle"
                      style={{ zIndex: 1 }}
                    ></span>
                  )}
                  <i className="bi bi-bell fs-4"></i>
                  {translations[language].Notifiations}
                 
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="d-md-none d-flex fixed-bottom justify-content-around bg-dark py-2 text-white shadow border-top">
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
