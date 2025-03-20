import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

function App() { 
  const [language, setLanguage] = useState("en");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (storedUser) {
      let userObject = JSON.parse(storedUser);
      setId(userObject._id);
    }
    setLoading(false);
  }, [navigate]); 

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header language={language} setLanguage={setLanguage} id={id} />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Body language={language} />} />
        <Route path="/records" element={id ? <Records language={language} id={id} /> : <Navigate to="/login" />} />
        <Route path="/entry" element={id ? <Entry language={language} id={id} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login language={language} />} />
        <Route path="/register" element={<Register language={language} />} />
      </Routes>

      <Footer language={language} />
    </>
  );
}

export default App;
