import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Home is the layout
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products";
import Users from "./pages/users";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./pages/Profile";
import "./app.css";
import EditProducts from "./pages/editProducts";
import EditRecords from "./pages/editRecords";
import Login from "./pages/Login";
import { ThemeProvider } from "./Context/ThemeContext";
import Notification from "./pages/Notification";

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Admin Layout with Nested Routes */}
          <Route path="/" element={<Home />}>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
                        <Route path="/notification" element={<Notification />} />

                        <Route path="/edit-products/:id" element={<EditProducts />} />
            <Route path="/edit-records" element={<EditRecords />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
