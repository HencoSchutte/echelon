// src/components/Experience.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import device1 from "../assets/images/featured_device.png";
import device2 from "../assets/images/featured_device2.png";
import device3 from "../assets/images/featured_device3.png";

const features = [
  {
    title: "AI-Powered Discovery",
    desc: "Find the perfect device using intelligent search and recommendations.",
  },
  {
    title: "Curated Premium Brands",
    desc: "Only the best laptops, audio gear, smartphones and gaming tech.",
  },
  {
    title: "Fast Global Delivery",
    desc: "Reliable shipping with real-time order tracking.",
  },
  {
    title: "Exclusive Drops",
    desc: "Access limited releases and high-end technology first.",
  },
];

const devices = [device1, device2, device3];

export default function Experience() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % devices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-black via-black to-neutral-950 py-28 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0.3, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Headline with gradient like Hero */}
          <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Technology Without Compromise
          </h2>

          <p className="text-gray-400 mb-10 max-w-lg">
            Echelon is built for people who want the best electronics available.
            Discover premium devices, powered by intelligent recommendations
            and curated collections.
          </p>

          {/* Feature Grid with neon/pulse hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border border-neutral-800 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 border border-neutral-800 rounded-xl hover:ring-2 hover:ring-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-transform duration-300 bg-black/50"
                whileHover={{ scale: 1.06 }}
              >
                <h3 className="text-white text-sm md:text-base mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button with glow */}
          <button className="mt-10 px-6 py-3 bg-white text-black rounded-md hover:opacity-90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300">
            Explore Echelon
          </button>
        </motion.div>

        {/* RIGHT SIDE IMAGE ROTATOR */}
        <div className="relative flex justify-center md:justify-end h-[500px] md:h-[600px] lg:h-[700px]">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [0.95, 1.02, 1] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <img
              src={devices[index]}
              alt="Featured premium device"
              className="w-full h-full object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
            />

            {/* Glow / Halo */}
            <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-purple-500/20 blur-3xl rounded-full animate-pulse -z-10" />

            {/* Floating particles */}
            <div className="absolute top-10 left-20 w-2 h-2 bg-white/20 rounded-full animate-[float_5s_ease-in-out_infinite] -z-20" />
            <div className="absolute bottom-20 right-10 w-3 h-3 bg-white/25 rounded-full animate-[float_6s_ease-in-out_infinite] -z-20" />
          </motion.div>
        </div>
                

      </div>
    </section>
  );
}