import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";

const Orders = () => {
  const { backendUrl, token, currency, loading, setLoading } =
    useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  const fetchOrderData = async () => {
    try {
      if (!token) return;

      setLoading(true); // Start loading before API call
      const response = await axios.get(`${backendUrl}/api/order/user-orders`, {
        headers: {
          token: token,
        },
      });

      if (response.data.success) {
        let allOrdersItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItems.push(item);
          });
        });
        setOrderData(allOrdersItems.reverse());
      }
    } catch (error) {
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [token]);

  return (
    <div className="border-t pt-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-96">
      <div className="text-2xl mb-6">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA TÔI"} />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center my-10 text-gray-700">
          <p className="text-lg">Đang tải đơn hàng...</p>
        </div>
      ) : orderData.length === 0 ? (
        // No Orders Message
        <div className="flex flex-col items-center justify-center text-center my-10">
          <img
            src={assets.noorder}
            alt="No Orders"
            className="w-40 sm:w-60 mb-4"
            loading="lazy"
          />
          <p className="text-gray-700 mb-6">
            Start shopping to place your first order.
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white px-6 py-2 text-sm rounded-md"
          >
            Shop Now
          </button>
        </div>
      ) : (
        // Orders List
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-b border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  src={item.image[0]}
                  alt="product"
                  className="w-16 sm:w-20 "
                  loading="lazy"
                />
                <div>
                  <p className="text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-600">
                    <p>
                      {item.price} {currency}
                    </p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Kích thước: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Ngày:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Phương thức thanh toán:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={fetchOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  THEO DÕI ĐƠN HÀNG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
