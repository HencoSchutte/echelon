import { useState } from "react";

export default function ProductImage({ src, name }) {
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setStyle({
      transform: `rotateX(${y * -6}deg) rotateY(${x * 6}deg) scale(1.04)`
    });
  };

  const reset = () => {
    setStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)"
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative"
      style={{ perspective: "1200px" }}
    >
      {/* glow */}
      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>

      <div
        style={style}
        className="transition-transform duration-300 border border-neutral-800 rounded-2xl overflow-hidden will-change-transform"
      >
        <img
          src={src}
          alt={name}
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}