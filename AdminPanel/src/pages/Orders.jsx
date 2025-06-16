import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast, Zoom } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/admin_assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: { 
            'admintoken': token,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        console.log("Orders data:", response.data.orders);
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.", {
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
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch all orders.", {
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
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/update-status`,
        { orderId, status: newStatus },
        {
          headers: { 
            'admintoken': token,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated successfully!", {
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
        toast.error(response.data.message || "Failed to update order status.", {
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
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.", {
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
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📦 Order Details
      </h2>

      {orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="bg-white shadow-md border border-gray-200 rounded-lg p-5 transition duration-300 hover:shadow-lg hover:border-gray-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-[5fr_3fr_3fr_2fr_3fr] xl:grid-cols-[7fr_4fr_3.5fr_2fr_3.5fr] gap-4 items-start">
                {/* Order Details */}
                <div className="flex flex-col md:flex-row items-start gap-3">
                  <img
                    src={assets?.parcel_icon}
                    alt="parcel icon"
                    className="w-14 h-14 md:w-10 md:h-10 object-contain"
                    loading="lazy"
                  />
                  <div className="w-full">
                    {order.items?.map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        <span className="font-semibold">{item.name}</span> x{" "}
                        {item.quantity} ({item.size})
                      </p>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="rounded-lg space-y-1">
                  <p className="font-semibold text-gray-800 flex items-center gap-1">
                    👤 Địa chỉ giao hàng
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    📍 {order.address?.address}, {order.address?.commune}, {order.address?.district}, {order.address?.province}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="space-y-1 text-sm">
                  <p>
                    🛍️ <span className="font-medium">Sản phẩm:</span>{" "}
                    {order.items?.length || 0}
                  </p>
                  <p>
                    💳 <span className="font-medium">Phương thức thanh toán:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  <p>
                    ✅ <span className="font-medium">Thanh toán:</span>{" "}
                    {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                  </p>
                  <p>
                    📅 <span className="font-medium">Ngày:</span>{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Order Amount */}
                <div className="font-medium text-lg text-gray-700">
                  {currency} {order.amount}
                </div>

                {/* Status Dropdown */}
                <div className="-mt-1">
                  <label className="text-sm font-medium text-gray-700">
                    Trạng thái:
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                    className="w-full p-2 border rounded text-sm font-semibold bg-white hover:border-gray-400"
                  >
                    <option value="Order Placed">🛒 Đã đặt hàng</option>
                    <option value="Packing">📦 Đang đóng gói</option>
                    <option value="Shipped">🚚 Đang giao hàng</option>
                    <option value="Out for Delivery">
                      🚀 Đang giao hàng
                    </option>
                    <option value="Delivered">✅ Đã giao hàng</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg mt-10">
          Không có đơn hàng nào. 📭
        </p>
      )}
    </div>
  );
};

export default Orders;
