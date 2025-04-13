import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./pages/Body";
import Records from "./pages/Records";
import Entry from "./pages/Entry";
import Login from "./pages/login";
import Register from "./pages/register";
import Analysis from "./pages/Analysis";
import LoadingSpinner from "./components/Loadong";
import EditRecords from "./pages/EditRecords";

function App() {
  const [language, setLanguage] = useState("en");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/Admin");

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObject = JSON.parse(storedUser);
        setId(userObject._id);
      }
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAdminRoute) {
      window.open(`${import.meta.env.VITE_ADMIN_URI}`, "_blank");
      navigate("/");
    }
  }, [isAdminRoute, navigate]);

  if (loading) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {!isAdminRoute && <Header language={language} setLanguage={setLanguage} id={id} />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Body language={language} />} />
        <Route
          path="/records"
          element={id ? <Records language={language} id={id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/entry"
          element={id ? <Entry language={language} id={id} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login language={language} />} />
        <Route path="/register" element={<Register language={language} />} />
        <Route path="/Analysis" element={<Analysis language={language} />} />
        <Route path="/edit-records" element={<EditRecords language={language} />} />

      </Routes>
      {!isAdminRoute && <Footer language={language} />}
    </>
  );
}

export default App;
