import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Layers,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const [financial, customers] = await Promise.all([
          axios.get("/api/reports/financial", config),
          axios.get("/api/reports/customers", config),
        ]);

        setStats({
          revenue: financial.data.totalRevenue,
          orders: financial.data.totalOrders,
          products: 0, // will connect later
          customers: customers.data.allCustomers.length,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading)
    return <p className="text-white text-center mt-24">Loading dashboard...</p>;

  return (
    <section className="min-h-screen bg-black text-white pt-24 px-6 md:px-12">
      <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

      {/* QUICK STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<ShoppingCart />}
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
        />
        <StatCard icon={<Package />} title="Orders" value={stats.orders} />
        <StatCard icon={<Layers />} title="Products" value={stats.products} />
        <StatCard icon={<Users />} title="Customers" value={stats.customers} />
      </div>

      {/* ADMIN ACTIONS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          title="Manage Products"
          icon={<Package />}
          onClick={() => navigate("/admin/products")}
        />

        <ActionCard
          title="Manage Categories"
          icon={<Layers />}
          onClick={() => navigate("/admin/categories")}
        />

        <ActionCard
          title="View Orders"
          icon={<ShoppingCart />}
          onClick={() => navigate("/admin/orders")}
        />

        <ActionCard
          title="Reports & Analytics"
          icon={<BarChart3 />}
          onClick={() => navigate("/admin/reports")}
        />
      </div>
    </section>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 shadow-lg flex items-center gap-4"
    >
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}

function ActionCard({ title, icon, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className="cursor-pointer p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.35)] transition"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-indigo-400">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
    </motion.div>
  );
}