import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Truck, Clock, CreditCard } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (error) {
        console.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrder();
  }, [id, user]);

  if (loading)
    return <p className="text-center text-white mt-24">Loading order...</p>;

  if (!order)
    return <p className="text-center text-red-500 mt-24">Order not found</p>;

  const statusIcons = {
    pending: <Clock />,
    paid: <CreditCard />,
    shipped: <Truck />,
    complete: <CheckCircle />,
  };

  const statusColors = {
    pending: "text-yellow-400",
    paid: "text-blue-400",
    shipped: "text-purple-400",
    complete: "text-green-400",
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 backdrop-blur"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-gray-400 text-sm">
                Order ID: {order._id}
              </p>
            </div>

            <div
              className={`flex items-center gap-2 ${statusColors[order.status]}`}
            >
              {statusIcons[order.status]}
              <span className="capitalize">{order.status}</span>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <InfoCard
              title="Payment Method"
              value={order.paymentMethod.toUpperCase()}
            />
            <InfoCard
              title="Total"
              value={`$${order.totalPrice.toFixed(2)}`}
            />
            <InfoCard
              title="Placed On"
              value={new Date(order.createdAt).toLocaleDateString()}
            />
          </div>

          {/* Products */}
          <div className="space-y-4">
            {order.products.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-neutral-900 border border-neutral-800 rounded-xl"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-indigo-400 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}