import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  if (!product) return null;
  const goToProduct = () => {
    navigate(`/product/${product.id}`);
    onClose();
  };
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-sm z-40"
          />

          {/* Modal container */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="relative max-w-3xl w-full rounded-2xl overflow-hidden">

              {/* Neon glow */}
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-indigo-400/40 to-purple-500/40 blur-xl opacity-60" />

              {/* Main card */}
              <div className="relative bg-neutral-900 border border-white/10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-50"
                >
                  <X size={22} />
                </button>

                <div className="flex flex-col md:flex-row">

                  {/* Image */}
                  <div className="md:w-1/2 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-700 hover:scale-105"
                    />

                    {/* image glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-purple-500/10 blur-2xl" />
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 p-7 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl text-white font-semibold">
                        {product.name}
                      </h2>

                      <p className="text-indigo-400 mt-2 text-lg">
                        ${product.price.toLocaleString()}
                      </p>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-2 mt-5">
                        {product.specifications && Object.entries(product.specifications).map(([key, value], i) => (
  <                         span key={i}
                            className="text-xs px-3 py-1 rounded-full 
                            bg-indigo-600/25 border border-indigo-400/30 
                            text-indigo-200 backdrop-blur
                            shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-400 mt-5 text-sm">
                        Premium device selected for performance, design, and
                        cutting-edge technology within the Echelon ecosystem.
                      </p>
                    </div>
                    <div className="mt-6 flex gap-3"></div>
                    <button
                      onClick={goToProduct}
                      className="flex-1 py-3 border border-indigo-500/40 text-indigo-300 rounded-lg 
                      hover:bg-indigo-600/20 transition"
                    >
                      View Product
                    </button>
                    <button 
                    onClick={() => addToCart({ ...product, _id: product.id })}
                    className="mt-2 w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                      Add to Cart
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}