import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Header = ({ toggleSidebar }) => {
  const [notification, setNotification] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        setLoggedIn(true);
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user) return;

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/notifications/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.adminread) {
          setNotification(true);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    checkLogin();
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <header
      className={`py-3 px-4 d-flex justify-content-between align-items-center shadow-sm position-fixed top-0  w-100 
        ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}
      style={{ zIndex: 1000 }}
    >
      <h2 className="m-0">
        <Link
          className={`${darkMode ? "text-light" : "text-dark"}`}
          style={{ textDecoration: "none" }}
          to="/"
        >
          Admin Panel
        </Link>
      </h2>

      <div className="d-flex align-items-center">
        {/* Dark Mode Toggle */}
        <button
          className="btn btn-outline-secondary me-3"
          onClick={toggleDarkMode}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Admin
          </button>

          <ul
            className={`dropdown-menu dropdown-menu-end ${
              darkMode ? "bg-dark text-light" : "bg-white text-dark"
            }`}
            aria-labelledby="dropdownMenuButton"
          >
            {loggedIn ? (
              <>
                <li>
                  <NavLink className="dropdown-item" to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink className="dropdown-item" to="/login">
                  Login
                </NavLink>
              </li>
            )}
            <li className="nav-item position-relative">
              <Link
                to="/notification"
                className="dropdown-item d-flex align-items-center gap-2 position-relative"
              >
                {notification && (
                  <span
                    className="position-absolute top-0  mx-3 my-2 translate-middle p-1 bg-danger border border-light rounded-circle"
                    style={{ zIndex: 1 }}
                  ></span>
                )}
                <i className="bi bi-bell fs-5"></i> Notifications
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
