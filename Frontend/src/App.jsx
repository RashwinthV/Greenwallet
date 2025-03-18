import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./pages/Body";
import Records from "./pages/Records";
import Entry from "./pages/Entry";
import Login from "./pages/Login";
import Register from "./pages/register";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [language, setLanguage] = useState("en");
  let id = "";
  id = localStorage.getItem("userid");

  return (
    <>
      <Header language={language} setLanguage={setLanguage} />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Body language={language} />} />
        <Route path="/records" element={<Records language={language} id={id} />} />
        <Route path="/entry" element={<Entry language={language} id={id} />} />
        <Route path="/login" element={<Login language={language} />} />
        <Route path="/register" element={<Register language={language} />} />
      </Routes>
      <Footer language={language} />
    </>
  );
}

export default App;
