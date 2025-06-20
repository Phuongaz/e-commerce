import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    loading,
    setLoading,
    token,
    backendUrl,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (products.length > 0) {
      const tempData = Object.entries(cartItems).flatMap(([productId, sizes]) =>
        Object.entries(sizes)
          .filter(([size, quantity]) => quantity > 0)
          .map(([size, quantity]) => ({ _id: productId, size, quantity }))
      );
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Handle navigation change and set loading to false
  const handleNavigation = (path) => {
    setLoading(true);
    navigate(path);
    setTimeout(() => setLoading(false), 500);
  };

  // Handle checkout process
  const handleCheckout = async () => {
    setLoading(true);
    if (!token) {
      // If no token, show error toast and redirect to login
      toast.error("Vui lòng đăng nhập để đặt hàng", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      setTimeout(() => {
        navigate("/login", { state: { from: location.pathname } });
      }, 1200);
    } else {
      try {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {};
        
        // Nếu có giỏ hàng guest, thực hiện merge
        if (Object.keys(guestCart).length > 0) {
          await axios.post(
            `${backendUrl}/api/cart`,
            { guestCart },
            { 
              headers: { 
                "Content-Type": "application/json",
                token: token 
              },
              withCredentials: true
            }
          );
          localStorage.removeItem("guestCart");
        }
        
        navigate("/place-order");
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xử lý giỏ hàng", {
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
        setLoading(false);
      }
    }
  };

  return (
    <div className="border-t pt-14 relative px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="relative flex justify-between items-start mb-3">
        <div className="text-2xl">
          <Title text1={"Giỏ"} text2={"Hàng"} />
        </div>

        {cartData.length > 0 && (
          <button
            onClick={() => navigate("/collection")}
            className="flex items-center text-white bg-blue-700 hover:bg-blue-600 transition px-3 py-2 rounded font-medium"
          >
            <span>Tiếp tục mua hàng</span>
            <IoIosArrowForward className="size-4 ml-1" />
          </button>
        )}
      </div>

      {/* If cart is empty */}
      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={assets.cartempty} // Add an empty cart image in assets
            alt="Empty Cart"
            className="w-40 sm:w-60 mb-4"
            loading="lazy"
          />
          <p className="text-2xl text-gray-900 font-medium">
            Giỏ hàng của bạn trống!
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Có vẻ như bạn chưa thêm gì vào giỏ hàng của mình.
          </p>
          <button
            onClick={() => handleNavigation("/collection")}
            className="bg-black text-white px-6 py-2 text-sm rounded-md"
          >
            Mua hàng ngay
          </button>
        </div>
      ) : (
        <>
          {/* If cart has items */}
          <div>
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );
              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20"
                      src={productData.image[0]}
                      alt="product images"
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {productData.price} {currency}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 focus:outline-none focus:border-gray-300"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (isNaN(value) || value <= 0) value = 1;
                      updateQuantity(item._id, item.size, value);
                    }}
                  />
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    src={assets.bin_icon}
                    alt="bin icon"
                    className="w-4 sm:w-5 mr-4 cursor-pointer"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={handleCheckout}
                  className={` text-white w-52 h-11 text-sm my-8 bg-green-700 hover:bg-green-800
                      ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "TIẾP TỤC THANH TOÁN"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
