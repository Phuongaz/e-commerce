import React, { useContext } from "react";
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
import { AuthContext } from "./context/AuthContext";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "VNĐ";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  return (
    <div className="min-h-screen">
      <ToastContainer />
      {isAuthenticated === null ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/add-item"
                  element={<AddProduct />}
                />
                <Route
                  path="/update-item/:id"
                  element={<UpdateProduct />}
                />
                <Route
                  path="/list-items"
                  element={<ListProducts />}
                />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
