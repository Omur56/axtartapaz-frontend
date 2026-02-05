import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function UltimateGlassBubble({ children }) {
  const ref = useRef(null);
  const [explosions, setExplosions] = useState([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  // Mouse & touch
  useEffect(() => {
    const el = ref.current;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX || e.touches?.[0]?.clientX;
      const y = e.clientY || e.touches?.[0]?.clientY;

      mouseX.set(x - rect.width / 2);
      mouseY.set(y - rect.height / 2);
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("touchmove", move);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("touchmove", move);
    };
  }, []);

  // Explosion
  const explode = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setExplosions((prev) => [...prev, { x, y, id: Date.now() }]);

    setTimeout(() => {
      setExplosions((p) => p.slice(1));
    }, 900);
  };

  return (
    <div
      ref={ref}
      onClick={explode}
      className="relative w-full h-full overflow-hidden"
      style={{ perspective: 1000 }}
    >
      {/* 🌈 Animated gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(120deg,#ff00cc,#3333ff,#00ffd5,#ffcc00)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* 🌊 Floating bubbles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full backdrop-blur-xl"
          style={{
            width: 140 + i * 12,
            height: 140 + i * 12,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background:
              "linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,.05))",
            border: "1px solid rgba(255,255,255,.3)",
            boxShadow:
              "0 0 40px rgba(255,255,255,.3), inset 0 0 25px rgba(255,255,255,.2)",
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, 60, 0],
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🌀 Mouse 3D glow */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          background:
            "radial-gradient(circle,rgba(255,255,255,.7),rgba(0,200,255,.3),transparent)",
          filter: "blur(40px)",
        }}
      />

      {/* 💥 Explosion bubbles */}
      {explosions.map((e) => (
        <motion.div
          key={e.id}
          className="absolute w-6 h-6 rounded-full bg-white"
          style={{ left: e.x, top: e.y }}
          animate={{
            scale: [1, 3],
            opacity: [1, 0],
            x: [0, Math.random() * 120 - 60],
            y: [0, Math.random() * 120 - 60],
          }}
          transition={{ duration: 0.8 }}
        />
      ))}

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
