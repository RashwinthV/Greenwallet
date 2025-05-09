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
import EditRecords from "./pages/EditRecords";
import Profile from "./pages/User/profile";
import VerifyEmail from "./components/verifyEmail";
import useAuth from"./Hooks/useAuth";
import LoginLoader from "./components/Loading/loginLoader";
import Notification from "./pages/User/Notification";

function App() {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const location = useLocation();
  const {logout, user, loading } = useAuth(); 
  const id=user?._id


  const isAdminRoute = location.pathname.startsWith("/Admin");

  useEffect(() => {
    if (isAdminRoute) {
      window.open(`${import.meta.env.VITE_ADMIN_URI}`, "_blank");
      navigate("/");
    }
  }, [isAdminRoute, navigate]);

  if (loading && location.pathname === "/") {
    return (
      <div style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
        <LoginLoader />
      </div>
    );
  }
  

  return (
    <>
      {!isAdminRoute && <Header language={language} setLanguage={setLanguage} user={user}  logout={logout}/>}
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
        <Route path="/profile" element={<Profile language={language} />} />
        <Route path="/notification" element={<Notification language={language} />} />
        <Route path="/verify-email" element={<VerifyEmail/>}/>

      </Routes>
      {!isAdminRoute && <Footer language={language} />}
    </>
  );
}

export default App;
