import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./productCard";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}