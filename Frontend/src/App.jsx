import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./pages/Body";
import Records from "./pages/Records";
import Entry from "./pages/Entry";
import Login from "./pages/login";
import Register from "./pages/register";
import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./context/Authcontextt";

function App() { 
  const [language, setLanguage] = useState("en");
  const { user } = useContext(AuthContext);
  let id = user?.id || "";

  return (
    <>
      <Header language={language} setLanguage={setLanguage} />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Body language={language} />} />
        <Route path="/records" element={user ? <Records language={language} id={id} /> : <Navigate to="/login" />} />
        <Route path="/entry" element={user ? <Entry language={language} id={id} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login language={language} />} />
        <Route path="/register" element={<Register language={language} />} />
      </Routes>

      <Footer language={language} />
    </>
  );
}

export default App;
