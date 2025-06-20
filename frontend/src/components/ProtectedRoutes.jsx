// src/routes/ProtectedRoutes.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";

export const ProtectedRoute = ({ children }) => {
  const { loginSuccess } = useContext(ShopContext);

  if (loginSuccess === null) return <div>Loading...</div>;

  return loginSuccess ? children : <Navigate to="/login" replace />;
};

export const GuestRoute = ({ children }) => {
  const { loginSuccess } = useContext(ShopContext);

  if (loginSuccess === null) return <div>Loading...</div>;

  return !loginSuccess ? children : <Navigate to="/" replace />;
};
