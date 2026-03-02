import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X } from "lucide-react";

export default function ImageSearch() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    setImage(file);
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/api/products/image-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(data);
      if (!data.length) setError("No visually similar products found");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search image");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className="relative flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/50 rounded-2xl h-60 cursor-pointer hover:border-indigo-400 transition-all bg-neutral-900/50"
      >
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />

        <UploadCloud size={48} className="text-indigo-400 mb-2" />
        {!image && <p className="text-gray-400">Drag & drop an image or click to upload</p>}

        {/* Preview */}
        <AnimatePresence>
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-4 left-4 right-4 bottom-4 flex justify-center items-center"
            >
              <img
                src={URL.createObjectURL(image) + "#preview"}
                alt="Preview"
                className="h-full object-contain rounded-xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setResults([]);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-600/60 hover:bg-red-600 transition"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-white text-center">Searching for similar products...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">Matching Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((product) => (
              <motion.div
                key={product._id}
                layout
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(139,92,246,0.5)" }}
                className="bg-neutral-900/50 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-indigo-400 font-semibold">${product.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && image && results.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-12 text-center text-gray-400">
          <p className="text-lg font-medium">No products found for this image.</p>
          <p className="text-sm text-gray-500 mt-1">Try another image or check back later.</p>
        </div>
      )}
    </div>
  );
}