import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const checkAuthValidity = async () => {

    try {
      //send request to backend to verify token
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        toast.warning("Session expired. Please log in again.", {
          position: "top-center",
          autoClose: 1500,
        });

        setTimeout(() => {
          setIsAuthenticated(false);
          navigate("/login");
        }, 1000);
      } else {
        console.log("Auth verification successful");
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated === null) {
      checkAuthValidity();
    }
  }, [isAuthenticated]);

  return <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>{children}</AuthContext.Provider>;
};
