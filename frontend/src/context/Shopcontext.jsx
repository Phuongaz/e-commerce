import { createContext, useEffect, useState, useContext } from "react";
import { toast, Zoom } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { getProfile } from "../api/user";
import { getProducts } from "../api/product";
import { getCart, addToCart as addToCartAPI, updateCart as updateCartAPI, mergeCart, deleteCartItem } from "../api/cart";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VNĐ";
  const delivery_fee = 10;
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
    if (guestCart && !isAuthenticated) {
      console.log("Loading guest cart from localStorage:", guestCart);
      
      // Convert object format to array format
      const cartArray = [];
      Object.entries(guestCart).forEach(([productId, sizes]) => {
        Object.entries(sizes).forEach(([size, quantity]) => {
          if (quantity > 0) {
            cartArray.push({
              product_id: productId,
              quantity: quantity,
              size: size
            });
          }
        });
      });
      
      console.log("Converted guest cart to array format:", cartArray);
      setCartItems(cartArray);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        if (response.data.success) {
          await handleUserLogin();
        }
      } catch (error) {
        console.log('User not authenticated or profile fetch failed');
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  // Handle user login - merge guest cart and fetch user cart
  const handleUserLogin = async () => {
    try {
      // Check if there's a guest cart to merge
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {};
      const hasGuestCart = Object.keys(guestCart).length > 0;

      if (hasGuestCart) {
        console.log("Merging guest cart on login:", guestCart);
        
        // Convert guest cart to backend format
        const cartItems = [];
        for (const [productId, sizes] of Object.entries(guestCart)) {
          for (const [size, quantity] of Object.entries(sizes)) {
            cartItems.push({
              product_id: productId,
              quantity: quantity,
              size: size
            });
          }
        }
        
        try {
          // Use mergeCart API to merge all items at once
          const response = await mergeCart(cartItems);
          
          if (response.data.success) {
            // Clear guest cart after successful merge
            localStorage.removeItem("guestCart");
            toast.success("Cart merged successfully!");
          } else {
            console.error("Failed to merge cart:", response.data.message);
            toast.error("Failed to merge cart");
          }
        } catch (error) {
          console.error("Failed to merge cart:", error);
          toast.error("Failed to merge cart");
        }
      }

      await getUserCart();
      
    } catch (error) {
      console.error("Error handling user login:", error);
      toast.error("Failed to sync cart data");
    }
  };

  const addToCart = async (productId, quantity = 1, size) => {
    console.log("Adding to cart:", { productId, quantity, size });
    
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

    if (isAuthenticated) {
      try {
        console.log("Adding to cart for authenticated user...");
        const response = await addToCartAPI(productId, quantity, size);
        console.log("Add to cart API response:", response);
        
        if (response.data.success) {
          toast.success(response.data.message || "Product added to cart successfully!");
          await getUserCart();
          navigate("/cart");
        } else {
          toast.error(response.data.message || "Failed to add product to cart");
        }
      } catch (error) {
        console.error("Add to cart API error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to add product to cart");
      }
    } else {
      console.log("Adding to guest cart. Current cartItems:", cartItems);
      
      const cartObject = {};
      if (Array.isArray(cartItems)) {
        cartItems.forEach(item => {
          if (!cartObject[item.product_id]) {
            cartObject[item.product_id] = {};
          }
          cartObject[item.product_id][item.size] = item.quantity;
        });
      }
      
      console.log("Current cart object structure:", cartObject);
      
      const currentQuantity = cartObject[productId]?.[size] || 0;
      const newQuantity = currentQuantity + quantity;
      
      console.log(`Product ${productId} size ${size}: ${currentQuantity} + ${quantity} = ${newQuantity}`);
      
      if (!cartObject[productId]) {
        cartObject[productId] = {};
      }
      cartObject[productId][size] = newQuantity;
      
      console.log("Updated cart object:", cartObject);
      
      const cartArray = [];
      Object.entries(cartObject).forEach(([productId, sizes]) => {
        Object.entries(sizes).forEach(([size, quantity]) => {
          if (quantity > 0) {
            cartArray.push({
              product_id: productId,
              quantity: quantity,
              size: size
            });
          }
        });
      });
      
      console.log("Final cart array:", cartArray);
      
      setCartItems(cartArray);
      localStorage.setItem("guestCart", JSON.stringify(cartObject)); // Keep object format in localStorage
      
      toast.success(`Added ${quantity} item(s) to cart! Total: ${newQuantity}`);
      navigate("/cart");
    }
  };

  const deleteItemFromCart = async (productId, size) => {
    console.log("Deleting cart item:", { productId, size });
    const response = await deleteCartItem(productId, size);
    console.log("Delete cart item API response:", response);
    if (response.data.success) {
      toast.success("Cart item deleted successfully!");
      await getUserCart();
    } else {
      toast.error(response.data.message || "Failed to delete cart item");
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    console.log("Updating cart quantity:", { itemId, size, quantity });

    if (isAuthenticated) {
      try {
        const response = await updateCartAPI(itemId, quantity, size);
        console.log("Update cart API response:", response);
        
        if (response.data.success) {
          toast.success(response.data.message || "Cart updated successfully!");
          await getUserCart();
        } else {
          toast.error(response.data.message || "Failed to update cart");
        }
      } catch (error) {
        console.error("Update cart API error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update cart");
      }
    } else {
      // For guest users - update both cartItems array and localStorage object
      let updatedCartItems = [...cartItems];
      
      if (quantity === 0) {
        updatedCartItems = updatedCartItems.filter(
          item => !(item.product_id === itemId && item.size === size)
        );
      } else {
        const itemIndex = updatedCartItems.findIndex(
          item => item.product_id === itemId && item.size === size
        );
        
        if (itemIndex >= 0) {
          updatedCartItems[itemIndex].quantity = quantity;
        }
      }
      
      setCartItems(updatedCartItems);
      
      const cartObject = {};
      updatedCartItems.forEach(item => {
        if (!cartObject[item.product_id]) {
          cartObject[item.product_id] = {};
        }
        cartObject[item.product_id][item.size] = item.quantity;
      });
      
      localStorage.setItem("guestCart", JSON.stringify(cartObject));
    }
  };

  const getUserCart = async () => {
    try {
      console.log("Fetching user cart...");
      const response = await getCart();
      console.log("Get cart API response:", response);
      
      if (response.data.success) {
        const cartData = response.data.data?.items || {};
        console.log("Setting cart items:", cartData);
        setCartItems(cartData);
      } else {
        console.error("Failed to fetch cart:", response.data.message);
        toast.error(response.data.message || "Failed to fetch cart");
      }
    } catch (error) {
      console.error("Get cart API error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch cart", {
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
    if (Array.isArray(cartItems)) {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    }
    return Object.values(cartItems).reduce(
      (count, sizes) => count + Object.values(sizes).reduce((a, b) => a + b, 0),
      0
    );
  };

  //---------------- Get Cart Amount ----------------//

  const getCartAmount = () => {
    if (Array.isArray(cartItems)) {
      return cartItems.reduce((total, item) => {
        const itemInfo = products.find((product) => product._id === item.product_id);
        if (itemInfo) {
          return total + (item.quantity * itemInfo.price);
        }
        return total;
      }, 0);
    }
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
    setLoading(true);
    try {
      console.log("Fetching products...");
      const response = await getProducts();
      console.log("Products response:", response);
      
      if (response?.data?.success) {
        const productsData = response.data.data || [];
        console.log("Products data:", productsData);
        setProducts(productsData);
        
        if (productsData.length === 0) {
          toast.info("No products available");
        }
      } else {
        console.error("Products fetch failed:", response?.data);
        toast.error(response?.data?.message || "Failed to fetch products");
        setProducts([]);
      }
    } catch (error) {
      console.error("Products fetch error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
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
    deleteItemFromCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    loading,
    setLoading
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;