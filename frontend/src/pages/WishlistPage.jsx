import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data } = await axios.get("/api/wishlist", config);
        setWishlist(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load wishlist");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.delete(`/api/wishlist/${id}`, config);

      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Failed to remove item");
    }
  };

  if (!user)
    return (
      <p className="text-center text-white mt-24">
        Please log in to view your wishlist.
      </p>
    );

  if (loading)
    return <p className="text-center text-white mt-24">Loading wishlist...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-24">{error}</p>;

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="text-indigo-400" />
          <h1 className="text-4xl font-bold">My Wishlist</h1>
        </div>
        <p className="text-gray-400">
          Items you’ve saved for later.
        </p>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center p-12 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800">
          <Heart className="mx-auto mb-4 text-indigo-400" size={42} />
          <p className="text-gray-400 mb-6 text-lg">
            Your wishlist is empty.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition shadow-lg"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="group p-5 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 hover:border-indigo-500/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] transition"
              >
                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="cursor-pointer mb-4 overflow-hidden rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Info */}
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-indigo-300 font-medium mb-4">
                  ${item.price}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
                  >
                    <ShoppingCart size={16} />
                    View
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="flex items-center justify-center px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/60 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}