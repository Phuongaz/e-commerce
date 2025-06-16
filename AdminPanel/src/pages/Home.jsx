import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Home = ({ token }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/admin/stats`, {
        headers: {
          admintoken: token,
        },
      });
      if (response?.data?.success) {
        setStats({
          totalUsers: response.data.totalUsers,
          totalOrders: response.data.totalOrders,
          totalProducts: response.data.totalProducts,
        });
      }
    } catch (error) {
      console.error("Error fetching statistics", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return (
    <div className="p-5 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <StatCard title="Tổng người dùng" count={stats.totalUsers} color="blue" />
        <StatCard
          title="Tổng đơn hàng"
          count={stats.totalOrders}
          color="green"
        />
        <StatCard
          title="Tổng sản phẩm"
          count={stats.totalProducts}
          color="purple"
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => {
  const colorClasses = {
    blue: "text-blue-600 border-blue-400 bg-blue-100",
    green: "text-green-600 border-green-400 bg-green-100",
    purple: "text-purple-600 border-purple-400 bg-purple-100",
  };

  return (
    <div
      className={`p-6 border-l-4 rounded-lg shadow-lg  ${colorClasses[color]}`}
    >
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className={`text-4xl font-bold ${colorClasses[color]}`}>{count}</p>
    </div>
  );
};

export default Home;
