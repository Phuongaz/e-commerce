import { createContext, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const checkTokenValidity = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) return;

    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-token`, {
        token: storedToken,
      });

      if (response.data.tokenExpired) {
        toast.warning("Session expired. Please log in again.", {
          position: "top-center",
          autoClose: 1500,
        });

        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
