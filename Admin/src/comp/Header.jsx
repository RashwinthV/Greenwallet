import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
  };

  return (
    <header
      className={`py-3 px-4 d-flex justify-content-between align-items-center shadow-sm 
        ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}
    >
      <h2 className="m-0">
      <Link className="nav" style={{textDecoration:"none" ,color:"black"}} to="/">

        Admin Panel
        </Link>
        </h2>

      <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-secondary me-3"
          onClick={handleThemeToggle}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Admin
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <NavLink className="dropdown-item" to="/profile">
                Profile
              </NavLink>
            </li>
            <li>
              <button className="dropdown-item">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
