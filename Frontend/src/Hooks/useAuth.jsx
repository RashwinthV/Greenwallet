import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setId(parsedUser._id);
      }

      if (!savedToken) {
        setLoading(false);
        return;
      }

      const verifyToken = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/user/verify-token`,
            {
              headers: { Authorization: `Bearer ${savedToken}` },
            }
          );

          if (res.data?.user) {
            setId(res.data.user._id);
          } else {
            handleSessionExpiry();
          }
        } catch (err) {
          console.error("Token verification failed", err);
          handleSessionExpiry();
        } finally {
          setLoading(false);
        }
      };

      const handleSessionExpiry = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setId(null);
        toast.info("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      };

      verifyToken();
    }, 1000); // ⬅️ Delay of 1 second like in your original useEffect

    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setId(null);
    toast.success("You have been logged out.");
  };

  return { user, id, loading, logout };
};

export default useAuth;