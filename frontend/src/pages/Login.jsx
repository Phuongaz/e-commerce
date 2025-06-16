import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const location = useLocation();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    try {
      const endpoint = currentState === "Sign Up" ? "/register" : "/login";
      const payload =
        currentState === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const response = await axios.post(
        `${backendUrl}/api/user${endpoint}`,
        payload
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message, {
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
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (token && storedToken) {
      // ✅ Check both token state & localStorage
      const redirectTo = location.state?.from || "/";
      setTimeout(() => {
        navigate(redirectTo);
      }, 1200);
    }
  }, [token, navigate, location.state]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-xl p-10 mt-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          {currentState === "Login" ? "Welcome Back!" : "Create an Account"}
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-5">
          {currentState === "Sign Up" && (
            <div className="relative">
              <FaUser className="absolute top-4 left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-md"
                required
                autoComplete="true"
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-md"
              required
              autoComplete="true"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-md"
              required
              autoComplete="true"
            />
          </div>

          {/* Forgot Password Link */}
          {currentState === "Login" && (
            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-700 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-300 ${
              isButtonDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-800"
            }`}
            disabled={isButtonDisabled}
          >
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-700">
            {currentState === "Login"
              ? "New here? "
              : "Already have an account? "}
            <span
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
              onClick={() =>
                setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
              }
            >
              {currentState === "Login" ? "Create Account" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
