import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../comp/sidebar";
import Header from "../comp/Header";
import Footer from "../comp/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from "./Welcome";
import { ThemeContext } from "../Context/ThemeContext";

function Home() {
  const location = useLocation(); // Get current route path
    const { darkMode } = useContext(ThemeContext);


  return (
    <div className={`"d-flex flex-column vh-100" ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-3">
          {/* Only show Welcome on the root page */}
          {location.pathname === "/" ? <Welcome /> : <Outlet />}
        </main>
      </div>
      <Footer  />
    </div>
  );
}

export default Home;
