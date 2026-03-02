import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Heart,
  Settings,
  LogOut,
  Mail,
  User,
  Clock,
  Star,
  UserIcon,
} from "lucide-react";

export default function UserProfile() {
  const { user, fetchProfile, logout } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistCount, setWishlistCount] = useState(user?.wishlist?.length ?? 0);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin"; 

  useEffect(() => {
  setWishlistCount(user?.wishlist?.length ?? 0);
}, [user?.wishlist]);

  useEffect(() => {
  const loadData = async () => {
    try {
      await fetchProfile();

      if (user?.token) {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data } = await axios.get("/api/orders/myorders", config);
        setOrders(data); // ADDED
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  loadData();
}, [fetchProfile, user?.token]);

  if (loading) return <p className="text-white text-center mt-24">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-24">{error}</p>;

  return (
    <section className="min-h-screen bg-black text-white pt-24 px-6 md:px-12">
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
      {/* PROFILE HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="relative h-40 rounded-3xl bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-indigo-600/40 border border-neutral-800 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-xl"></div>
        </div>

        <div className="relative flex items-center gap-6 -mt-16 px-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-full border-4 border-indigo-500/60 overflow-hidden shadow-[0_0_45px_rgba(99,102,241,0.7)] flex items-center justify-center bg-neutral-800"
            >
            {user.avatar ? (
                <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                />
            ) : (
                <UserIcon size={48} className="text-indigo-400" />
            )}
            </motion.div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-[280px,1fr] gap-8">
        {/* LEFT MENU */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-600/10 to-purple-600/10 backdrop-blur-xl border border-indigo-500/20 h-fit">
          <div className="space-y-3">
            {isAdmin && (
                <>
                    <button
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
                    >
                    <Package size={18} /> Manage Products
                    </button>

                    <button
                    onClick={() => navigate("/admin/categories")}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
                    >
                    <Settings size={18} /> Manage Categories
                    </button>

                    <button
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
                    >
                    <Package size={18} /> View Orders
                    </button>

                    <button
                    onClick={() => navigate("/admin/reports")}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
                    >
                    <Star size={18} /> Reports
                    </button>

                    <hr className="border-neutral-700 my-2" />
                </>
                )}
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
            >
              <Package size={18} /> Orders
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
            >
              <Heart size={18} /> Wishlist
            </button>

            <button
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-neutral-800 transition"
            >
              <Settings size={18} /> Settings
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-600/20 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-8">
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard icon={<Package />} title="Orders" value={isAdmin ? "All" : orders.length} />
            <StatCard icon={<Heart />} title="Wishlist" value={wishlistCount} />
            <StatCard icon={<Star />} title="Reviews" value="0" />
          </div>

          {/* ACCOUNT INFO */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_35px_rgba(99,102,241,0.25)]">
            <h3 className="text-xl font-semibold mb-6 border-b border-indigo-500/20 pb-3">
                Account Information
            </h3>

            <div className="space-y-4 text-indigo-100">
              <div className="flex items-center gap-3">
                <User size={18} className="text-indigo-400" />
                {user.name}
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400" />
                {user.email}
              </div>

              <div className="flex items-center gap-3">
                <Clock size={18} className="text-indigo-400" />
                Member since {new Date(user.createdAt || Date.now()).getFullYear()}
              </div>
            </div>
          </div>

          {/* RECENT ORDERS */}
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold mb-4 border-b border-indigo-500/20 pb-3">
                    Recent Orders
                </h3>

                {orders.length > 0 && (
                <button
                    onClick={() => navigate("/orders")}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                >
                    View all
                </button>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-6">
                You haven’t placed any orders yet.
                </div>
            ) : (
                <div className="space-y-4">
                {(() => {
                    const displayedOrders = isAdmin ? orders : orders.slice(0, 3);
                    return displayedOrders.map((order) => (
                    <motion.div
                    key={order._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] cursor-pointer transition-all"
                    >
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                        <span className="font-medium text-gray-200">
                            Order #{order._id.slice(-6)}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        </div>

                        <span className="text-sm font-semibold text-white">
                        ${order.totalPrice.toFixed(2)}
                        </span>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-between items-center">
                        <span
                        className={`text-xs px-3 py-1 rounded-full capitalize ${
                            order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "paid"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.status === "shipped"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                        >
                        {order.status}
                        </span>

                        <span className="text-xs text-gray-500">
                        {order.products.length} items
                        </span>
                    </div>
                    </motion.div>
                ));
             })()}
                </div>
            )}
            </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.35)] flex items-center gap-4 transition"
    >
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}