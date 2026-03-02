import React, { useEffect } from "react";
import "./Loader.css";

export default function Loader() {
  // Prevent scrolling while loader is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="Loader-wrapper">
      <div className="Loader" data-text="Loading">
        <span className="Loader__Circle"></span>
        <span className="Loader__Circle"></span>
        <span className="Loader__Circle"></span>
        <span className="Loader__Circle"></span>
      </div>
    </div>
  );
}