import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ language, setLanguage }) => {
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

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setLanguage]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const storedUserId = localStorage.getItem("userid");
  const isLoggedIn = storedUserId !== null && storedUserId !== "null";
  let id = "";
  let role = localStorage.getItem("role");

  try {
    id = JSON.parse(storedUserId)?._id || "";
  } catch (error) {
    console.error("Error parsing userid:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          Green Wallet
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul
            className="navbar-nav ms-auto gap-5"
            style={{
              fontFamily: "Exo 2, sans-serif",
              fontWeight: 400,
              fontSize: 19,
            }}
          >
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  {texts[language].admin}
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/">
                {texts[language].home}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/records">
                {texts[language].records}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/entry/${id}`}>
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
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    {texts[language].signup}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    {texts[language].login}
                  </Link>
                </li>
              </>
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
  );
};

export default Header;
