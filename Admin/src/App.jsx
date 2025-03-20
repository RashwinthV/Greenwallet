import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Home is the layout
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./pages/Profile";
import'./app.css'

function App() {
  return (
   <div className="app">
   <Routes>
        {/* Admin Layout with Nested Routes */}
        <Route path="/" element={<Home />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile/>}/>
        </Route>
      </Routes>
   </div>
      
  );
} 

export default App;
