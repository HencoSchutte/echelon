import axios from "axios";

const API_URL = "/api/orders/";

export const getMyOrders = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_URL}myorders`, config);
  return data;
};

export const getOrderById = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_URL}${id}`, config);
  return data;
};

export const createOrder = async (orderData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.post(API_URL, orderData, config);
  return data;
};

export const checkoutCart = async (paymentData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.post(`${API_URL}checkout`, paymentData, config);
  return data;
};

// Optional: admin routes
export const getAllOrders = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(API_URL, config);
  return data;
};