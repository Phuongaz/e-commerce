import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkAuthValidity = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        console.log("Auth check: User not authenticated");
        setIsAuthenticated(false);
      } else {
        console.log("Auth verification successful");
        setIsAuthenticated(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Auth check: User not authenticated (401)");
        setIsAuthenticated(false);
      } else {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    checkAuthValidity();
  }, []);

  return <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, checkAuthValidity}}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
