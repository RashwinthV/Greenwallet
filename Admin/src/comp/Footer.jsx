import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "../Context/ThemeContext";

const Footer = () => {
    const { darkMode } = useContext(ThemeContext);

  return (
    <footer className={`" text-center py-4  py-3 mt-auto shadow-sm mb-5 mb-md-0"  ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`} >
      <p className="m-0">&copy; {new Date().getFullYear()} Admin Dashboard</p>
    </footer>
  );
};

export default Footer;
