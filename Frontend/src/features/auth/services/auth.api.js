import axios from "axios";

const api = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const register = async (userData) => {
  try {
    const response = await api.post(`/register`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post(`/login`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.get(`/logout`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async () => {
  try {
    const response = await api.get(`/get-me`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
