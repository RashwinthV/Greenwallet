import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaBox, FaUsers, FaTachometerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AdminSidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="d-flex">
      <div
        className={`sidebar bg-white text-dark vh-100 p-2 pt-3 ${
          isOpen ? "open" : "closed"
        }`}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className={`text-dark ${isOpen ? "" : "d-none"}`}></h3>
          <button className="btn btn-danger" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <nav className="nav flex-column">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "nav-link bg-primary text-white mt-3"
                : "nav-link text-dark mt-3"
            }
            onClick={handleLinkClick}
          >
            <FaTachometerAlt className="me-2" />
            <span className={isOpen ? "" : "d-none"}>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "nav-link bg-primary text-white mt-3"
                : "nav-link text-dark mt-3"
            }
            onClick={handleLinkClick}
          >
            <FaBox className="me-2" />
            <span className={isOpen ? "" : "d-none"}>Products</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "nav-link bg-primary text-white mt-3"
                : "nav-link text-dark mt-3"
            }
            onClick={handleLinkClick}
          >
            <FaUsers className="me-2" />
            <span className={isOpen ? "" : "d-none"}>All Users</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
