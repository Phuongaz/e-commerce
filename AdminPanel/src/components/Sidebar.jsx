import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlus,
  FaList,
  FaShoppingCart,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-[20%] min-h-screen bg-white shadow-md border-r border-gray-200 p-5">
      {/* Navigation Menu */}
      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition duration-300 ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <FaTachometerAlt className="w-5 h-5 shrink-0" />
          <p className="hidden md:block">Dashboard</p>
        </NavLink>

        <NavLink
          to="/add-item"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition duration-300 ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <FaPlus className="w-5 h-5 shrink-0" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          to="/list-items"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition duration-300 ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <FaList className="w-5 h-5 shrink-0" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition duration-300 ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <FaShoppingCart className="w-5 h-5 shrink-0" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
