import { createContext, useEffect, useState, useContext } from "react";
import { toast, Zoom } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

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
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  // Load guest cart from localStorage
  useEffect(() => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"));
    if (guestCart) {
      setCartItems(guestCart);
    }
  }, []);

  // Fetch user cart if logged in
  useEffect(async () => {
    //get profile from backend
    const response = await axios.get(`${backendUrl}/api/user/profile`, {
      withCredentials: true,
    });
    if (response.data.success) {
      getUserCart(response.data.userID);
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

    if (loginSuccess) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/cart/add`,
          { itemId, size },
          { withCredentials: true }
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

    try {
      const cartItem = {
        productId: itemId,
        size: size,
        quantity: quantity,
      }

        const response = await axios.put(
          `${backendUrl}/api/user/cart/update`,
          cartItem,
          { withCredentials: true }
        );
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
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

  //---------------- Get User Cart (Only for Logged-In Users) ----------------//

  const getUserCart = async (userID) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/cart/user-cart`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCartItems(response.data.data);
      } else {
        toast.error(response.data.message);
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
        `${backendUrl}/api/products`, {
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
    loading,
    setLoading
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;