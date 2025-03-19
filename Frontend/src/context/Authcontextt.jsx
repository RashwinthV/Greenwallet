import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Fetch User Data on Page Load
 

  const login = async (email, password) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URI}/login`, { email, password }, { withCredentials: true });
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/me`, { withCredentials: true });
    setUser(res.data.user);
  };
 useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URI}/me`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null)); 
  }, []);
  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URI}/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
