/*export const getProducts = async () => {
  const res = await fetch("http://localhost:5000/api/products");
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`http://localhost:5000/api/products/${id}`);
  return res.json();
};*/

const API_URL = import.meta.env.VITE_API_URL; // <- Vite env

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/api/products`);
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  return res.json();
};