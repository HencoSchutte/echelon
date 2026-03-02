import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, ImageIcon, Tag, Boxes } from "lucide-react";

export default function AdminProductForm() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    countInStock: "",
    tags: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data } = await axios.get(`/api/products/${id}`, config);

        setProduct({
          name: data.name || "",
          price: data.price || "",
          category: data.category?.name || data.category || "",
          description: data.description || "",
          countInStock: data.countInStock || 0,
          tags: data.tags?.join(", ") || "",
          image: data.images?.[0] || "",
        });
      } catch (err) {
        alert("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, isEdit, user.token]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const payload = {
        ...product,
        price: Number(product.price),
        countInStock: Number(product.countInStock),
        tags: product.tags.split(",").map((t) => t.trim()),
      };

      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload, config);
      } else {
        await axios.post(`/api/products`, payload, config);
      }

      navigate("/admin/products");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>

          <h1 className="text-3xl font-light ">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
        </div>

        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* LEFT SIDE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-indigo-400">
              Product Details
            </h2>

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-400">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* PRICE + STOCK */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Stock</label>
                <input
                  type="number"
                  name="countInStock"
                  value={product.countInStock}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Boxes size={14} />
                Category
              </label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Tag size={14} />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={product.tags}
                onChange={handleChange}
                placeholder="gaming, gpu, nvidia"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                name="description"
                rows={4}
                value={product.description}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-indigo-400 mb-6">
              Product Image
            </h2>

            {/* IMAGE INPUT */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <ImageIcon size={16} />
                Image URL
              </div>

              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="https://image-url.com/product.jpg"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />

              {/* IMAGE PREVIEW */}
              <div className="rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                {product.image ? (
                  <img
                    src={product.image}
                    alt="preview"
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="h-56 flex items-center justify-center text-gray-500">
                    Image preview
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
              mt-8 w-full flex items-center justify-center gap-2
              py-3 rounded-xl
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500
              border border-indigo-500/30
              shadow-[0_0_30px_rgba(99,102,241,0.35)]
              transition
            "
            >
              <Save size={18} />
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}