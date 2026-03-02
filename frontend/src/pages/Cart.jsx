import { motion } from "framer-motion";
import { Trash2, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext"; // use context
import { useNavigate } from "react-router-dom";

export default function CartPage() {

  const navigate = useNavigate();
  const {
  cartItems,
  incrementQuantity,
  decrementQuantity,
  deleteFromCart,
} = useCart();

  // Calculate total
    const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
    );

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white px-6 md:px-12 py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[160px] rounded-full opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-light mb-12">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-center py-24">Your cart is empty</p>
        ) : (
          <motion.div layout className="grid md:grid-cols-3 gap-10">
            {/* Cart items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item, i) => (
                <motion.div
                  key={i}
                  layout
                  className="flex items-center gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_60px_rgba(99,102,241,0.3)] transition"
                >
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-neutral-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <p className="text-indigo-400 mt-1">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => decrementQuantity(item._id)}
                        className="w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
                        >
                        -
                        </button>
                      <span className="min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item._id)}
                        className="w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
                        >
                        +
                        </button>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteFromCart(item._id)}
                    className="text-red-500 hover:text-red-400 transition ml-auto"
                  >
                    <Trash2 />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 backdrop-blur shadow-[0_15px_60px_rgba(0,0,0,0.5)]">
              <h2 className="text-2xl font-light mb-6">Summary</h2>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Items ({cartItems.length})</span>
                <span>
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-neutral-700 my-4" />
              <button 
              onClick={() => navigate("/checkout")}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl text-white font-medium hover:from-indigo-500 hover:to-indigo-400 shadow-[0_0_35px_rgba(99,102,241,0.5)] transition-all">
                Proceed to Checkout
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <p className="text-sm text-gray-400 text-center mt-4">
                    Purchase protected by{" "}
                    <span className="text-indigo-400 font-medium">
                        Echelon Money Back Guarantee
                    </span>
                </p>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}