import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  Tag,
  Boxes,
} from "lucide-react";

export default function AdminProducts() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(() => {
    const fetchProducts = async () => {
        if (!user?.token) return;

        try {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data } = await axios.get("/api/products", config);

        const normalizedProducts = data.map((p) => ({
            ...p,
            id: p.id,
            countInStock: p.countInStock ?? p.stock ?? 0,
            image: p.images?.[0] || "https://via.placeholder.com/150",
        }));

        setProducts(normalizedProducts);
        setLoading(false);
        } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setLoading(false);
        }
    };

    fetchProducts();
    }, [user?.token]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  if (loading)
    return (
      <p className="text-white text-center mt-24">Loading products...</p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-24">{error}</p>
    );

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <Package className="text-indigo-400" size={28} />
            <div>
              <h1 className="text-3xl font-light mb-1">Manage Products</h1>
              <p className="text-gray-400 text-sm">
                {products.length} products in store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                    pl-10 pr-4 py-2.5 w-[220px]
                    rounded-xl
                    bg-neutral-900/60
                    border border-neutral-700
                    text-sm text-white
                    placeholder:text-gray-500
                    backdrop-blur
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-500/40
                    focus:border-indigo-500
                    transition-all
                    "
                />
                </div>

            {/* ADD PRODUCT */}
            <button
                onClick={() => navigate("/admin/products/new")}
                className="
                    flex items-center gap-2 px-5 py-2.5
                    rounded-xl
                    bg-gradient-to-r from-indigo-600 to-indigo-500
                    hover:from-indigo-500 hover:to-indigo-400
                    text-white
                    transition-all duration-200
                    shadow-[0_0_20px_rgba(99,102,241,0.45)]
                    border border-indigo-500/40
                "
                >
                <Plus size={18} />
                Add Product
                </button>
          </div>
        </div>

        {/* GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-24">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const inStock = p.countInStock ?? p.stock > 0;

              return (
                <motion.div
                   key={p.id}
                    whileHover={{ y: -8 }}
                    className="
                        group
                        rounded-2xl overflow-hidden
                        bg-neutral-900/70
                        border border-neutral-800
                        hover:border-indigo-500/40
                        transition-all
                        shadow-[0_0_0_rgba(0,0,0,0)]
                        hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)]
                        backdrop-blur
                    "
                    >
                  {/* IMAGE */}
                  <div className="h-44 bg-neutral-900 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover hover:scale-110 transition"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <span className="text-indigo-400 font-semibold">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>

                    {/* CATEGORY */}
                    {p.category && (
                      <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                        <Boxes size={14} />
                        {p.category.name || p.category}
                      </div>
                    )}

                    {/* STOCK */}
                    <div className="mb-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          inStock
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {inStock
                          ? `${p.countInStock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* TAGS */}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 text-xs px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 pt-2">
                        <button
                            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                            bg-indigo-600/20 border border-indigo-500/30 
                            hover:bg-indigo-600/30 hover:border-indigo-400
                            text-indigo-300 hover:text-white
                            text-sm transition-all duration-200
                            shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                        >
                            <Pencil size={14} />
                            Edit
                        </button>

                        <button
                            onClick={async () => {
                            if (!confirm("Delete this product?")) return;

                            try {
                                const config = {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                },
                                };

                                await axios.delete(`/api/products/${p.id}`, config);

                                setProducts(
                                products.filter((prod) => prod.id !== p.id)
                                );
                            } catch {
                                alert("Failed to delete product");
                            }
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                            bg-red-500/10 border border-red-500/30 
                            hover:bg-red-500/20 hover:border-red-400
                            text-red-400 hover:text-red-200
                            text-sm transition-all duration-200"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                        </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}