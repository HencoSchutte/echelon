import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Trash2, PlusCircle, Edit2, Search } from "lucide-react";

export default function AdminCategories() {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/categories", config);
        setCategories(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [user?.token]);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post("/api/categories", { name: newCategory }, config);
      setCategories([...categories, data]);
      setNewCategory("");
    } catch {
      alert("Failed to add category");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/categories/${id}`, config);
      setCategories(categories.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete category");
    }
  };

  const updateCategory = async (id, name) => {
    if (!name.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/categories/${id}`, { name }, config);
      setCategories(categories.map(c => c._id === id ? data : c));
      setEditingId(null);
      setEditingName("");
    } catch {
      alert("Failed to update category");
    }
  };

  if (loading) return <p className="text-white text-center mt-24">Loading categories...</p>;

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <h1 className="text-4xl font-bold mb-6 text-indigo-400">Manage Categories</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-lg">
        <div className="relative flex-1">
          <Search size={18} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-3 rounded-3xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category..."
            className="flex-1 px-5 py-3 rounded-3xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={addCategory}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl hover:from-indigo-500 hover:to-purple-500 transition shadow-lg"
          >
            <PlusCircle size={18} /> Add
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <Reorder.Group
        axis="y"
        values={filteredCategories}
        onReorder={setCategories}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredCategories.map(cat => (
            <Reorder.Item key={cat._id} value={cat}>
              <motion.div
                layout
                whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(139,92,246,0.4)" }}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-700/20 to-purple-700/20 backdrop-blur-xl border border-indigo-500/30 transition"
              >
                <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                {editingId === cat._id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={() => updateCategory(cat._id, editingName)}
                    onKeyDown={e => e.key === "Enter" && updateCategory(cat._id, editingName)}
                    autoFocus
                    className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white border border-indigo-500"
                  />
                ) : (
                  <h3
                    onClick={() => {
                      setEditingId(cat._id);
                      setEditingName(cat.name);
                    }}
                    className="text-xl font-semibold text-white mb-2 cursor-pointer hover:text-indigo-300 transition"
                  >
                    {cat.name}
                  </h3>
                )}

                <p className="text-sm text-gray-400 mb-4">ID: {cat._id.slice(-6)}</p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(cat._id)}
                    className="p-2 bg-indigo-600/40 hover:bg-indigo-500 rounded-full transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="p-2 bg-red-600/40 hover:bg-red-500 rounded-full transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {filteredCategories.length === 0 && (
        <p className="text-gray-400 text-center mt-12 text-lg">No categories found.</p>
      )}
    </section>
  );
}