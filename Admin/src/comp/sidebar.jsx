import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/AdminSidebar.css"; 

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div className="sidebar d-flex flex-column bg-white text-dark vh-100 p-3 border-end">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link my-2 ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-link my-2 ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-box me-2"></i>
            Products
          </NavLink>

          <NavLink
            to="/edit-records"
            className={({ isActive }) =>
              `nav-link my-2 ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit Records
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `nav-link my-2 ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-people me-2"></i>
            All Users
          </NavLink>
        </div>
      )}

      {/* Bottom Nav for Mobile */}
      {isMobile && (
        <nav className="d-flex d-md-none fixed-bottom justify-content-around bg-dark py-2 text-white shadow border-top">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-white text-center ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-speedometer2 fs-4"></i>
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `text-white text-center ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-box fs-4"></i>
          </NavLink>
          <NavLink
            to="/edit-records"
            className={({ isActive }) =>
              `text-white text-center ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-pencil-square fs-4"></i>
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-white text-center ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-people fs-4"></i>
          </NavLink>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
