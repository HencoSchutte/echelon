import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Truck, CheckCircle, Clock, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

export default function OrdersPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Expanded order
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Custom dropdown state
  const [statusOpen, setStatusOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/orders/myorders", config);
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    let temp = [...orders];
    if (statusFilter) temp = temp.filter(o => o.status === statusFilter);
    if (paymentFilter) temp = temp.filter(o => o.paymentMethod === paymentFilter);
    if (startDate) temp = temp.filter(o => new Date(o.createdAt) >= new Date(startDate));
    if (endDate) temp = temp.filter(o => new Date(o.createdAt) <= new Date(endDate));
    if (searchTerm) temp = temp.filter(o => o._id.includes(searchTerm));
    setFilteredOrders(temp);
  }, [statusFilter, paymentFilter, startDate, endDate, searchTerm, orders]);

  if (!user)
    return <p className="text-center mt-24 text-white">Please log in to view your orders.</p>;
  if (loading) return <p className="text-center mt-24 text-white">Loading orders...</p>;
  if (error) return <p className="text-center mt-24 text-red-500">{error}</p>;

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

  // Custom dropdown component
  const Dropdown = ({ label, options, selected, setSelected, open, setOpen }) => (
    <div className="relative min-w-[120px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white hover:border-indigo-500 transition"
      >
        {selected ? options.find(o => o.value === selected)?.label : label}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  setSelected(opt.value);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-indigo-600/30 cursor-pointer text-white"
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center md:text-left">My Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[150px] px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition"
        />

        <Dropdown
          label="Status"
          options={[
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "shipped", label: "Shipped" },
            { value: "complete", label: "Complete" },
          ]}
          selected={statusFilter}
          setSelected={setStatusFilter}
          open={statusOpen}
          setOpen={setStatusOpen}
        />

        <Dropdown
          label="Payment"
          options={[
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "paypal", label: "PayPal" },
          ]}
          selected={paymentFilter}
          setSelected={setPaymentFilter}
          open={paymentOpen}
          setOpen={setPaymentOpen}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:ring-2 focus:ring-indigo-500 transition"
        />

        <button
          onClick={() => {
            setStatusFilter("");
            setPaymentFilter("");
            setStartDate("");
            setEndDate("");
            setSearchTerm("");
          }}
          className="px-4 py-2 rounded-xl bg-red-600/40 text-white hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-400 mt-4 text-center">No orders match your criteria.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <motion.div
                key={order._id}
                layout
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                className={`cursor-pointer p-6 rounded-3xl bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg 
                  ${isExpanded ? "border-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.5)]" : ""}
                `}
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">{`Order ID: ${order._id}`}</p>
                    <p className="text-gray-400 text-sm">{`Placed on: ${new Date(order.createdAt).toLocaleDateString()}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusClasses[order.status]}`}>
                      {statusIcons[order.status]}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <div>{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                  </div>
                </div>

                <p className="text-gray-200 font-medium mb-3">Total: ${order.totalPrice.toFixed(2)}</p>

                {/* Expandable products */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="mt-3 p-4 bg-neutral-900/80 rounded-2xl flex flex-col gap-2 text-gray-300"
                    >
                      {order.products.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-medium">{p.name} x {p.quantity}</span>
                          <span className="text-gray-200">${(p.price * p.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}