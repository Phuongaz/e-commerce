import { createContext, useEffect, useState } from "react";
import { getProfile } from "../api/user";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkAuthValidity = async () => {
    try {
      const response = await getProfile();
      if (response.data.success === false) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
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
