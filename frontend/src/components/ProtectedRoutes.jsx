// src/routes/ProtectedRoutes.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};
