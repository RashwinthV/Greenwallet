import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../comp/sidebar";
import Header from "../comp/Header";
import Footer from "../comp/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        {/* Render the child components correctly */}
        <main className="flex-grow-1 p-3 bg-light">
          <Outlet /> 
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
