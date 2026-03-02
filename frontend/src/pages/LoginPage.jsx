import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser(); // get login function from context
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors
    try {
      await login({ email, password }); // call backend via context
      navigate("/user"); // redirect to user profile page
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center px-6 md:px-12 overflow-hidden">
      
      {/* Background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-indigo-500/10 blur-[200px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md p-10 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">Welcome Back</h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:border-indigo-500 outline-none transition focus:ring-1 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-400 focus:border-indigo-500 outline-none transition focus:ring-1 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.9)] hover:scale-[1.03] transition-all duration-300"
          >
            Login
          </button>

          {/* Show backend error */}
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="flex-grow h-px bg-neutral-700"></span>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <span className="flex-grow h-px bg-neutral-700"></span>
        </div>

        {/* Register link */}
        <p className="text-gray-400 text-sm text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </section>
  );
}