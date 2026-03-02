export const getProducts = async () => {
  const res = await fetch("http://localhost:5000/api/products");
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`http://localhost:5000/api/products/${id}`);
  return res.json();
};