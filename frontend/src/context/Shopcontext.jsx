import { createContext, useEffect, useState } from "react";
import { toast, Zoom } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VNĐ";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Load guest cart from localStorage
  useEffect(() => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"));
    if (guestCart) {
      setCartItems(guestCart);
    }
  }, []);

  // Fetch user cart if logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, []);

  //----------------- Add to Cart (Handles Both Guest & Authenticated Users) ---------------//

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size", {
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
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);

    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );
    
        navigate("/cart");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      localStorage.setItem("guestCart", JSON.stringify(cartData));
      navigate("/cart");
    }
  };

  //---------------- Update Cart Quantity (Handles Both Guest & Authenticated Users) ----------------//

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = quantity;
      if (quantity === 0) delete cartData[itemId][size]; // Remove item if quantity is 0
    }
    setCartItems(cartData);

    if (token) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        toast.error(error.message, {
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
    } else {
      localStorage.setItem("guestCart", JSON.stringify(cartData));
    }
  };

  //---------------- Get User Cart (Only for Logged-In Users) ----------------//

  const getUserCart = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/cart/user-cart`, {
        headers: { token },
      });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error(error.message, {
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

  //---------------- Get Cart Count ----------------//

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (count, sizes) => count + Object.values(sizes).reduce((a, b) => a + b, 0),
      0
    );
  };

  //---------------- Get Cart Amount ----------------//

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        total += Object.values(sizes).reduce(
          (sum, qty) => sum + qty * itemInfo.price,
          0
        );
      }
      return total;
    }, 0);
  };

  //---------------- Get Products Data ----------------//

  const getProductsData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list-all-products`, {
          withCredentials:true
        }
      );
      if (response?.data?.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    setShowSearch,
    showSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    loading,
    setLoading,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;