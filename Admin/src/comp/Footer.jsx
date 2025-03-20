import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-white text-center text-dark py-3 mt-auto shadow-sm">
      <p className="m-0">&copy; {new Date().getFullYear()} Admin Dashboard</p>
    </footer>
  );
};

export default Footer;
