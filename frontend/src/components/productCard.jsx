import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function ProductCard({
  product,
  onClick,
  isWishlisted,
  onWishlistToggle,
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -10, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative group rounded-xl overflow-hidden cursor-pointer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWishlistToggle();
        }}
        className="absolute top-3 right-3 z-50 p-2 rounded-full bg-black/60 backdrop-blur-md hover:scale-110 transition pointer-events-auto"
      >
        <Heart
          size={18}
          className={`${
            isWishlisted
              ? "text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
              : "text-white"
          }`}
        />
      </button>

      {/* Metallic border */}
      <div className="absolute inset-0 rounded-xl border border-white/10 
      group-hover:border-white/40 transition duration-500 z-20" />

      {/* Silver shine sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none">
        <div className="absolute -left-1/2 top-0 h-full w-1/2 
        bg-gradient-to-r from-transparent via-white/30 to-transparent 
        skew-x-12 blur-md group-hover:animate-[shine_1.2s_ease]" />
      </div>

      {/* Neon edge glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -inset-[3px] rounded-xl 
        bg-gradient-to-r from-purple-500/40 via-indigo-400/40 to-purple-500/40 blur-xl" />
      </div>

      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className="h-56 w-full object-cover transition duration-700 group-hover:scale-115"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <h3 className="text-white text-lg font-medium tracking-wide">
          {product.name}
        </h3>

        <p className="text-gray-300 text-sm">${product.price.toLocaleString()}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {product.specs.map((spec, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-full 
              bg-indigo-600/25 border border-indigo-400/30 
              text-indigo-200 backdrop-blur
              group-hover:shadow-[0_0_12px_rgba(139,92,246,0.6)] 
              transition"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Deep glow under card */}
      <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-70 
      transition duration-500 blur-2xl bg-purple-600/30" />
    </motion.div>
  );
}