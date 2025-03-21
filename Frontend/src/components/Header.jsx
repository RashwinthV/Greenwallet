import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Header.css";

const Header = ({ language, setLanguage }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const texts = {
    en: { admin: "Admin Panel", home: "Home", records: "Records", entry: "Entry", signup: "Sign Up", login: "Login", logout: "Logout", language: "Language" },
    ta: { admin: "நிர்வாக குழு", home: "முகப்பு", records: "பதிவுகள்", entry: "நுழைவு", signup: "பதிவு செய்யவும்", login: "உள்நுழைவு", logout: "வெளியேறுதல்", language: "மொழி" },
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || "";
  const isLoggedIn = user !== null;

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) setLanguage(savedLanguage);
  }, [setLanguage]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setIsNavbarOpen(false); // Close navbar after language selection
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Function to close the navbar after clicking a link
  const closeNavbar = () => {
    setIsNavbarOpen(false);
    document.getElementById("navbarNav").classList.remove("show"); // Hide Bootstrap collapse
  };

  return (
    <nav id="Header" className="navbar navbar-expand-lg navbar-dark bg-dark">
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
            <p className="nav-item nav-link mt-1">
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
            {isLoggedIn ? (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
