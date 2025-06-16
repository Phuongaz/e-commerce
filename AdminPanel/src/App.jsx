import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ListProducts from "./pages/ListProducts";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Home from "./pages/Home";
import UpdateProduct from "./pages/UpdateProduct";
import AddProduct from "./pages/AddProduct";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "VNĐ";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : ""
  );

  useEffect(() => {
    localStorage.setItem("adminToken", token);
  }, [token]);

  return (
    <div className="min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login token={token} setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Home token={token} />} />
                <Route
                  path="/add-item"
                  element={<AddProduct token={token} />}
                />
                <Route
                  path="/update-item/:id"
                  element={<UpdateProduct token={token} />}
                />
                <Route
                  path="/list-items"
                  element={<ListProducts token={token} />}
                />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
