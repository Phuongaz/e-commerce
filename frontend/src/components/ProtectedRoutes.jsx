// src/routes/ProtectedRoutes.js
import React from "react";
import { Navigate } from "react-router-dom";

// Function to get token from localStorage
const getToken = () => localStorage.getItem("token");

// Protect Routes (Require Authentication)
export const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" replace />;
};

// Restrict Logged-in Users (Guest Only Routes)
export const GuestRoute = ({ children }) => {
  return !getToken() ? children : <Navigate to="/" replace />;
};
