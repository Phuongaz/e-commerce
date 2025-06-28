import axiosInstance from './axiosInstance';

export const getProducts = () => axiosInstance.get(`/api/products`);
export const getProductById = (id) => axiosInstance.get(`/api/products/${id}`);