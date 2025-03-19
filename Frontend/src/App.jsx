import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./pages/Body";
import Records from "./pages/Records";
import Entry from "./pages/Entry";
import Login from "./pages/login";
import Register from "./pages/register";
import { useContext, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./context/Authcontextt";

function App() { 
  const [language, setLanguage] = useState("en");
  const { user } = useContext(AuthContext);
  const [id, setId] = useState(null); // Use state to prevent early redirects

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (storedUser) {
      let userObject = JSON.parse(storedUser);
      setId(userObject._id); // Store the ID in state
    }
  }, []); // Runs once when the component mounts

  useEffect(() => {
    if (user) {
      setId(user._id || user.id); // If AuthContext updates, set the ID
    }
  }, [user]);

  // While checking auth, show a loading screen to avoid immediate redirects
  if (id === null) {
    return <div>Loading...</div>; // Temporary loading screen
  }

  return (
    <>
      <Header language={language} setLanguage={setLanguage} />
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
