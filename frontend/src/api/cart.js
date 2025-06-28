import axiosInstance from "./axiosInstance";

export const getCart = () => axiosInstance.get("/api/user/cart/user-cart");

export const addToCart = (productId, quantity, size) => 
  axiosInstance.post("/api/user/cart/add", { 
    product_id: productId, 
    quantity: quantity, 
    size: size 
  });

export const updateCart = (productId, quantity, size) => 
  axiosInstance.put("/api/user/cart/update", [{ 
    product_id: productId, 
    quantity: quantity, 
    size: size 
  }]);

export const deleteCartItem = (productId, size) => 
  axiosInstance.post("/api/user/cart/delete", {
    product_id: productId,
    size: size
  });

export const mergeCart = (cartItems) => 
  axiosInstance.post("/api/user/cart/merge", cartItems || []);