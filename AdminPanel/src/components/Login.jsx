import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";
import { AuthContext } from "../context/AuthContext";

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    // Set default values after component mounts
    if (adminEmail && adminPassword) {
      setEmail(adminEmail);
      setPassword(adminPassword);
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      const profileResponse = await axios.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      //check if user is admin
      if (profileResponse?.data?.data?.role !== "admin") {
        setIsAuthenticated(false);
        toast.error("You are not authorized to access this page", {
          position: "top-center",
          autoClose: 1500,
        });
      }

      if (loginResponse?.data?.success && profileResponse?.data?.success) {
        // Update token state
        setIsAuthenticated(true);
        navigate("/");
        setEmail("");
        setPassword("");
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        });
      } else {
        toast.error(response.data.message || "Login failed!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Logo Section */}
      <div className="w-60 mb-8">
        <img src={assets.logo} alt="AllWear logo" loading="lazy" />
      </div>

      {/* Login Card */}
      <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Admin Login
        </h1>

        <form onSubmit={onSubmitHandler}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            className="w-full py-2 mt-4 text-white bg-blue-800 rounded-md hover:bg-blue-700 transition-all duration-300 font-semibold shadow-md"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Phuongaz. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
