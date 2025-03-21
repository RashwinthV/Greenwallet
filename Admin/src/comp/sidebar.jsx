import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaBox, FaUsers, FaTachometerAlt, FaEdit, FaChevronDown } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AdminSidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);

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
    if (window.innerWidth < 600 ) {
      setIsOpen(false);
    }
  };

  return (
    <div className="d-flex">
      <div className={`sidebar bg-white text-dark vh-100 p-2 pt-3 ${isOpen ? "open" : "closed"}`}>
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
              isActive ? "nav-link bg-primary text-white mt-3" : "nav-link text-dark mt-3"
            }
            onClick={handleLinkClick}
          >
            <FaTachometerAlt className="me-2" />
            <span className={isOpen ? "" : "d-none"}>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-link bg-primary text-white mt-3" : "nav-link text-dark mt-3"
            }
            onClick={handleLinkClick}
          >
            <FaBox className="me-2" />
            <span className={isOpen ? "" : "d-none"}>Products</span>
          </NavLink>

          {/* Edit Dropdown Menu */}
          <div className="nav-item dropdown">
            <button
              className="nav-link text-dark mt-3 w-100 text-start d-flex align-items-center"
              onClick={() => setEditDropdownOpen(!editDropdownOpen)}
            >
              <FaEdit className="me-2" />
              <span className={isOpen ? "" : "d-none"}>Edit</span>
              <FaChevronDown className="ms-auto" />
            </button>

            {editDropdownOpen && (
              <div className="dropdown-menu show bg-light w-100">
                <NavLink
                  to="/edit-products"
                  className="dropdown-item text-dark"
                  onClick={handleLinkClick}
                >
                  Edit Products
                </NavLink>
                <NavLink
                  to="/edit-records"
                  className="dropdown-item text-dark" 
                  onClick={handleLinkClick}
                >
                  Edit Records
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link bg-primary text-white mt-3" : "nav-link text-dark mt-3"
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
