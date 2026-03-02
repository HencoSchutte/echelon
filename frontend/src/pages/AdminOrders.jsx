import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { Clock, CreditCard, Truck, CheckCircle } from "lucide-react";

export default function AdminOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const statusClasses = {
    pending: "bg-yellow-600/30 text-yellow-400",
    paid: "bg-blue-600/30 text-blue-400",
    shipped: "bg-purple-600/30 text-purple-400",
    complete: "bg-green-600/30 text-green-400",
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    paid: <CreditCard size={16} />,
    shipped: <Truck size={16} />,
    complete: <CheckCircle size={16} />,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/orders", config);
        setOrders(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.token]);

  const filteredOrders = orders.filter(
    (o) =>
      (!statusFilter || o.status === statusFilter) &&
      (!paymentFilter || o.paymentMethod === paymentFilter)
  );

  if (loading) return <p className="text-white text-center mt-24">Loading orders...</p>;

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="complete">Complete</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order._id}
            className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">#{order._id.slice(-6)}</span>{" "}
              <span className="text-gray-400 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusClasses[order.status]}`}>
              {statusIcons[order.status]}
              <span className="capitalize">{order.status}</span>
            </div>

            <div className="text-gray-300">{order.products.length} items</div>
            <div className="font-semibold">${order.totalPrice.toFixed(2)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}