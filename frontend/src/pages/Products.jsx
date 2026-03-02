import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/productCard";
import ProductModal from "../components/ProductModal";
import { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";



export default function Products() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, fetchProfile } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const categories = ["All", "GPU", "CPU", "Mobile", "RAM"];
  const navigate = useNavigate();
  const categoryMap = {
  "Smartphone": "Mobile",
  "Laptop": "Laptop",
  "Audio": "Audio",
  "Gaming": "GPU",
  "RAM": "RAM",
  "CPU": "CPU"
};

  useEffect(() => {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      // map backend fields to frontend-friendly format
      const mapped = data.map(p => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.price, // convert number to string with currency
        image: p.images?.[0] || "https://via.placeholder.com/150",
        specs: p.specifications
          ? Object.entries(p.specifications).map(([k,v]) => `${k}: ${v}`)
          : [],
      }));
      console.log("Mapped products:", mapped);
      setProducts(mapped);
    })
    .catch(err => console.error(err));
}, []);


useEffect(() => {
  if (!user) return;

  const fetchWishlist = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get("/api/wishlist", config);

      // store only ids for faster lookup
      setWishlist(data.map((item) => item._id));
    } catch (err) {
      console.error("Wishlist failed to load");
    }
  };

  fetchWishlist();
}, [user]);

const toggleWishlist = async (productId) => {
  if (!user) {
    navigate("/login");
    return;
  }
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };

  try {
    if (wishlist.includes(productId)) {
      await axios.delete(`/api/wishlist/${productId}`, config);
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      await axios.post("/api/wishlist", { productId }, config);
      setWishlist((prev) => [...prev, productId]);
    }
    await fetchProfile();

  } catch (err) {
    console.error("Wishlist update failed");
  }
};


  const featured = products[1] || null;
  const filteredProducts = products.filter((p) => {
  const matchesCategory =
    activeCategory === "All" || p.category === categoryMap[activeCategory] || p.category === activeCategory;
  const matchesSearch =
    p.name.toLowerCase().includes(query.toLowerCase());
  return matchesCategory && matchesSearch;
  });

  return (
    <section className="relative bg-black min-h-screen py-24 px-6 md:px-12 overflow-hidden">
      {/* Background glow like hero */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[160px] rounded-full opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* FEATURED PRODUCT */}
        {featured && (
            <motion.div
            initial={{ opacity: 0.3, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-20 relative overflow-hidden border border-neutral-800 rounded-2xl bg-gradient-to-b from-neutral-900/60 to-black p-8 md:p-12"
            >
            {/* glow */}
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full"></div>

            <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                
                {/* LEFT CONTENT */}
                <div>
                <span className="text-xs text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
                    AI Recommended
                </span>

                <h2 className="text-3xl md:text-4xl font-light text-white mt-4">
                    {featured.name}
                </h2>

                <p className="text-gray-400 mt-4 max-w-md">
                    Based on current trends and premium performance metrics,
                    this device is one of the most popular choices among
                    Echelon users.
                </p>

                {/* specs */}
                <div className="flex flex-wrap gap-2 mt-6">
                    {["A17 Chip", "Pro Camera", "Titanium Build"].map((spec, i) => (
                    <span
                        key={i}
                        className="text-xs px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-white"
                    >
                        {spec}
                    </span>
                    ))}
                </div>

                <button className="mt-8 px-6 py-3 bg-white text-black rounded-md hover:opacity-90 transition">
                    View Device
                </button>
                </div>

                {/* RIGHT IMAGE */}
                <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative flex justify-center md:justify-end"
                >
                <img
                  src={featured.image}
                  alt="Featured device"
                  className="w-[320px] md:w-[380px] drop-shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
              />

                {/* device glow */}
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full -z-10"></div>
                </motion.div>
            </div>
            </motion.div>
            )}

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0.4, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light text-white">
            Explore Products
          </h1>

          <p className="text-gray-400 mt-3">
            Discover premium electronics curated by Echelon.
          </p>
        </motion.div>

        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0.4, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-14"
        >
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/40 transition">
            <Search className="text-neutral-400 mr-3" size={18} />
            <input
              type="text"
              placeholder="Try: 'Noise cancelling headphones under $400'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-white w-full"
            />
          </div>

          <p className="text-xs text-neutral-500 mt-2">
            AI-powered search understands features, budget and device type.
          </p>
        </motion.div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">

          {/* SIDEBAR */}
          <motion.div
            initial={{ opacity: 0.3, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative border border-neutral-700 rounded-xl p-6 h-fit bg-neutral-900/40 backdrop-blur shadow-[inset_0_0_12px_rgba(255,255,255,0.05),0_0_30px_rgba(99,102,241,0.08)]">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={18} />
              <h3 className="text-white text-lg">Filters</h3>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-indigo-600/30 text-white border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      : "text-gray-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* PRODUCTS */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400 text-sm">
                {filteredProducts.length} products found
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="border border-neutral-800 rounded-xl p-16 text-center bg-neutral-900/20">
                <p className="text-gray-400">
                  No products found. Try another search.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.length > 0 &&
                  filteredProducts.map((product, i) => product && (
                    <ProductCard
                      key={i}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onWishlistToggle={() => toggleWishlist(product.id)}
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalOpen(true);
                      }}
                    />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {selectedProduct && (
      <ProductModal
        product={selectedProduct}  // the product data
        isOpen={modalOpen}          // controls visibility
        onClose={() => setModalOpen(false)} // close function
        />
        )}
    </section>
  );
}