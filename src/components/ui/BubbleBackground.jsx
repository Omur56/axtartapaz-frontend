import React from "react";
import { motion } from "framer-motion";

export default function UltimateGlass({ children }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 🌈 Rainbow animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(120deg, red, orange, yellow, green, cyan, blue, violet)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* 🧊 Glass blur layer */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
