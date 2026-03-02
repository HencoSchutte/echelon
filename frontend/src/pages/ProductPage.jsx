import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import ProductImage from "../components/productImage";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect  } from "react";
import { useCart } from "../context/CartContext";


export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
            setProducts(data);

            // use _id instead of id
            const foundProduct = data.find(p => String(p._id) === String(id));
            setProduct(foundProduct);

            setLoading(false);
            })
            .catch(err => {
            console.error(err);
            setLoading(false);
            });
        }, [id]);

  if (loading) return <div className="text-white text-center mt-24 animate-pulse">Loading product...</div>;
  if (!product) return <p className="text-white text-center mt-24">Product not found</p>;


  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white px-6 md:px-12 py-24 overflow-hidden">
      
      {/* background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[160px] rounded-full opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* PRODUCT HERO */}
        <motion.div
          initial={{ opacity: 0.3, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-16 items-center mb-28"
        >
          {/* Image */}
          <ProductImage src={product.images?.[0] || "/placeholder.png"} name={product.name} />

          {/* Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                {product.name}
                </h1>

                <div className="flex items-center gap-4 mt-3">
                <span className="text-indigo-400 text-2xl font-semibold">
                    ${product.price?.toLocaleString()}
                </span>

                <span className="px-3 py-1 text-xs border border-neutral-700 rounded-full text-gray-300">
                    {product.category || "Product"}
                </span>

                <span className="text-yellow-400 text-sm">★★★★★</span>
                </div>

            <p className="text-gray-400 mt-4 max-w-lg">
              Premium device selected by Echelon's recommendation engine.
              Designed for performance, longevity, and top-tier user experience.
            </p>

            {/* Specs */}
            <div className="flex flex-wrap gap-2 mt-6">
            {product.specifications && Object.entries(product.specifications).map(([key, value], i) => (
            <span key={i} className="text-xs px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full">
                {key}: {value}
            </span>
            ))}
            </div>
            

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">

            {/* Add to Cart */}
            <button
                onClick={() => addToCart(product)}
                className="
                relative px-8 py-4 rounded-xl font-medium text-white
                bg-gradient-to-r from-indigo-600 to-indigo-500
                hover:from-indigo-500 hover:to-indigo-400
                transition-all duration-300
                shadow-[0_0_30px_rgba(99,102,241,0.5)]
                hover:shadow-[0_0_60px_rgba(99,102,241,0.9)]
                hover:scale-[1.03]
                active:scale-[0.97]
                "
                >
                <span className="flex items-center gap-2">
                <ShoppingCart size={18} />
                Add to Cart
                </span>
            </button>

            {/* Compare */}
            <button
                className="
                px-8 py-4 rounded-xl font-medium
                border border-neutral-700
                bg-neutral-900/40
                backdrop-blur
                hover:border-indigo-500/40
                hover:bg-neutral-800
                transition-all duration-300
                hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
                "
            >
                Compare
            </button>

            </div>
          </div>
        </motion.div>

        {/* AI INSIGHTS */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-neutral-800 rounded-2xl p-10 mb-24 bg-gradient-to-b from-neutral-900/70 to-black backdrop-blur-xl"
            >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light">AI Insights</h2>
                <span className="text-xs px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full">
                Echelon AI
                </span>
            </div>

            <p className="text-gray-400 max-w-3xl leading-relaxed">
                Our AI analyzed thousands of reviews, benchmarks, and real-world usage
                patterns. This product stands out in performance, reliability, and long-term
                value. It is currently trending among power users and professionals.
            </p>
            </motion.div>

        {/* TECH SPECS */}
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {[
            ["Processor", "A17 Pro"],
            ["Storage", "256GB"],
            ["Display", "120Hz OLED"],
            ["Battery", "All-day usage"],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="border border-neutral-800 rounded-xl p-6 bg-gradient-to-b from-neutral-900/60 to-black hover:border-indigo-500/40 transition"
            >
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-white mt-1">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* RELATED PRODUCTS (placeholder) */}
        <div className="grid md:grid-cols-3 gap-6">
            {products
                .filter((p) => p.name !== product.name)
                .slice(0, 3)
                .map((item, i) => (
                <div
                    key={i}
                    className="border border-neutral-800 rounded-xl overflow-hidden hover:border-indigo-500/40 transition"
                >
                    <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                    />

                    <div className="p-4">
                    <p className="text-white">{item.name}</p>
                    <p className="text-indigo-400 text-sm">{item.price}</p>
                    </div>
                </div>
                ))}
            </div>

      </div>
    </section>
  );
}