import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Wallet, Banknote } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const placeOrder = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const products = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const { data } = await axios.post(
        "/api/orders",
        {
          products,
          paymentMethod,
        },
        config
      );

      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <section className="relative min-h-screen bg-black text-white px-6 md:px-12 py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[160px] rounded-full opacity-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[180px] rounded-full opacity-30" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 relative z-10">
        {/* ORDER ITEMS */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-light mb-12">Checkout</h1>

          {cartItems.map((item, i) => (
            <motion.div
              key={i}
              layout
              className="flex items-center gap-4 bg-neutral-900/50 p-5 rounded-3xl border border-neutral-800 backdrop-blur-lg shadow-[0_0_25px_rgba(139,92,246,0.2)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-neutral-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-400 mt-1">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-indigo-400 font-semibold text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* PAYMENT + SUMMARY */}
        <div className="bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800 backdrop-blur-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] h-fit">
          <h2 className="text-2xl font-light mb-6">Order Summary</h2>

          <div className="flex justify-between mb-2 text-gray-400">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span className="text-indigo-400 font-semibold text-lg">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-neutral-800 my-4"></div>

          {/* PAYMENT METHOD */}
          <h3 className="mb-3 text-lg font-medium">Payment Method</h3>
          <div className="space-y-3">
            <PaymentOption
              icon={<CreditCard />}
              label="Card"
              value="card"
              selected={paymentMethod}
              setSelected={setPaymentMethod}
            />
            <PaymentOption
              icon={<Wallet />}
              label="PayPal"
              value="paypal"
              selected={paymentMethod}
              setSelected={setPaymentMethod}
            />
            <PaymentOption
              icon={<Banknote />}
              label="Cash"
              value="cash"
              selected={paymentMethod}
              setSelected={setPaymentMethod}
            />
          </div>

          <button
            onClick={placeOrder}
            disabled={loading || cartItems.length === 0}
            className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:opacity-90 transition font-medium shadow-[0_0_35px_rgba(99,102,241,0.5)] disabled:opacity-40"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Secure checkout powered by <span className="text-indigo-400 font-medium">Echelon</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentOption({ icon, label, value, selected, setSelected }) {
  const active = selected === value;

  return (
    <button
      onClick={() => setSelected(value)}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition ${
        active
          ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
          : "border-neutral-800 hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]"
      }`}
    >
      <div className="text-indigo-400">{icon}</div>
      {label}
    </button>
  );
}