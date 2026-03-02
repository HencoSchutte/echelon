// src/components/Hero.jsx
import { useState, useMemo } from "react";
import { Upload, Search } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

// Debounce utility
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}


export default function HeroSearch() {
const navigate = useNavigate();
const [prompt, setPrompt] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [loadingSuggestions, setLoadingSuggestions] = useState(false);
const [errorSuggestions, setErrorSuggestions] = useState("");

  const handlePromptSearch = async () => {
    if (!prompt.trim()) return;

      setLoadingSuggestions(true);
      setErrorSuggestions("");
      setSuggestions([]);

      try {
        const { data } = await axios.post("/api/products/smart-search", { query: prompt });
        setSuggestions(data.results || []);
      } catch (err) {
        setErrorSuggestions(err.response?.data?.message || "Failed to fetch search results");
      } finally {
        setLoadingSuggestions(false);
      }
    };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Image uploaded:", file);
  };

  const fetchSuggestions = async (query) => {
  if (!query.trim()) {
    setSuggestions([]);
    return;
  }

  setLoadingSuggestions(true);
  setErrorSuggestions("");

  try {
    const { data } = await axios.post("/api/products/smart-search", { query });
    setSuggestions(data.results || []);
  } catch (err) {
    setErrorSuggestions(err.response?.data?.message || "Failed to fetch suggestions");
  } finally {
    setLoadingSuggestions(false);
  }
};

const debouncedFetch = useMemo(() => debounce(fetchSuggestions, 400), []);

  return (
    <section className="relative bg-gradient-to-b from-black via-neutral-950 to-black min-h-[80vh] md:min-h-[90vh] flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between px-4 sm:px-6 md:px-12 overflow-hidden">
      
      {/* Left: Headline + Search + Badges */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8 max-w-2xl md:ml-6"
      >
        {/* Headline with glowing underline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-6xl font-extralight text-white leading-tight relative"
        >
          Experience{" "}
          <span className="font-semibold text-white/80 relative">
            Electronics Elevated
            <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full blur-md bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/30 animate-pulse" />
            <span className="absolute inset-0 -z-10 rounded-lg bg-indigo-600/10 blur-2xl" />
          </span>
        </motion.h1>

        {/* Animated Highlight Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center md:justify-start"
        >
          {["AI-Powered", "Curated Devices", "Exclusive"].map((text, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-indigo-700/30 text-white text-xs px-3 py-1 rounded-full 
                        hover:shadow-[0_0_10px_rgba(236,72,153,0.6),0_0_20px_rgba(99,102,241,0.4)] 
                        transition-shadow duration-300"            >
              {text}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-400 text-sm md:text-base max-w-md"
        >
          Discover the latest high-end electronics with AI-powered product search and recommendations.
        </motion.p>

        {/* Prompt Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative w-full max-w-full"
        >
          {/* EXPANDABLE SEARCH CONTAINER */}
          <div className={`w-full bg-neutral-900/90 backdrop-blur-xl border rounded-xl shadow-xl transition-all duration-300 ${
            prompt ? "border-indigo-500/60 shadow-[0_0_25px_rgba(99,102,241,0.35)]" : "border-neutral-800"
          }`}>

            {/* SEARCH INPUT (top of dropdown) */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Describe what you want"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  debouncedFetch(e.target.value);
                }}
                className="w-full pl-11 pr-4 py-3 md:py-4 bg-transparent text-white placeholder-gray-500 outline-none"
              />
            </div>

            {/* ANTI BOUNCE AREA */}
            <div className="relative w-full">
              {loadingSuggestions && (
                <p className="text-gray-400 px-5 py-3 text-sm animate-pulse">
                  Searching...
                </p>
              )}

              {errorSuggestions && (
                <p className="text-red-500 px-5 py-3 text-sm">
                  {errorSuggestions}
                </p>
              )}

              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-50 top-full left-0 w-full max-h-[260px] mt-2 bg-neutral-900/70 backdrop-blur-lg border border-neutral-800 rounded-2xl shadow-lg overflow-y-auto scrollbar-thin"
                >
                  {suggestions.map((p) => (
                    <div
                      key={p._id}
                      onClick={() =>  navigate(`/product/${p._id}`)}
                      className="flex justify-between items-center py-3 px-5 hover:bg-indigo-600/20 transition-all duration-200 cursor-pointer rounded-lg"
                    >
                      <span className="text-white font-medium">{p.name}</span>
                      <span className="text-indigo-400 font-semibold">${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

                {/* Animated Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex gap-6 mt-6 justify-center md:justify-start text-gray-400 text-sm"
        >
          {["500+ Products", "20+ Premium Brands", "AI Recommendations"].map(
            (stat, i) => (
              <span key={i}>{stat}</span>
            )
          )}
        </motion.div>

        {/* Secondary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex gap-4 mt-4"
        >
          <button className="px-5 py-2 border border-neutral-800 text-gray-300 rounded-md hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition duration-300">
            Browse Featured
          </button>
          <button className="px-5 py-2 border border-neutral-800 text-gray-300 rounded-md hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition duration-300">
            View New Arrivals
          </button>
        </motion.div>

        {/* Image Upload */}
        <motion.label
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="flex items-center justify-center gap-2 mt-4 px-4 py-2 border border-neutral-800 rounded-lg cursor-pointer hover:border-purple-400/80 transition text-gray-300 shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
        >
          <Upload size={18} /> Upload an image to find similar products
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </motion.label>
      </motion.div>

      {/* Right: Glowing background */}
      <motion.div
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none overflow-hidden"
      >
        {/* Main gradient blob */}
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-600/30 via-purple-500/30 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating particles */}
        <div className="absolute top-20 right-10 w-2 h-2 bg-white/30 rounded-full animate-[float_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-64 right-32 w-3 h-3 bg-white/20 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-32 right-20 w-2 h-2 bg-white/25 rounded-full animate-[float_5s_ease-in-out_infinite]"></div>
      </motion.div>
    </section>
  );
}