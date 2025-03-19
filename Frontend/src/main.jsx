import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/Authcontextt.jsx"; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min";

createRoot(document.getElementById("root")).render(
  <AuthProvider> 
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
