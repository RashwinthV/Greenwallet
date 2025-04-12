import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./pages/Body";
import Records from "./pages/Records";
import Entry from "./pages/Entry";
import Login from "./pages/login";
import Register from "./pages/register";
import Analysis from "./pages/Analysis";

function App() {
  const [language, setLanguage] = useState("en");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Fix: Define location correctly

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (storedUser) {
      let userObject = JSON.parse(storedUser);
      setId(userObject._id);
    }
    setLoading(false);
  }, [navigate]);

  const isAdminRoute = location.pathname.startsWith("/Admin"); // ✅ Fix: Now works correctly

  // ✅ Open Admin Panel in a New Tab
  useEffect(() => {
    if (isAdminRoute) {
      window.open(`${import.meta.env.VITE_ADMIN_URI}`, "_blank");
      navigate("/"); 
    }
  }, [isAdminRoute, navigate]);

  if (loading) return <div>Loading...</div>;

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
        <Route path="/Analysis" element={<Analysis language={language}/>}/>
        
        {/* ✅ No Need for an Admin Route (Handled in useEffect) */}
      </Routes>
      {!isAdminRoute && <Footer language={language} />}
    </>
  );
}

export default App;
