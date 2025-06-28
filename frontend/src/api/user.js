import axiosInstance from './axiosInstance';

export const getProfile = () => axiosInstance.get(`/api/user/profile`);

export const updateProfile = (data) => axiosInstance.put(`/api/user/profile`, data);

export const Login = (data) => axiosInstance.post(`/api/auth/login`, data);
export const Logout = () => axiosInstance.post(`/api/auth/logout`);