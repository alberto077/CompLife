"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const PARTICLE_COLORS = [
  "#818cf8", // indigo
  "#a78bfa", // purple
  "#c084fc", // violet
  "#f472b6", // pink
  "#34d399", // emerald
  "#fbbf24", // amber
];

interface XPCelebrationProps {
  show: boolean;
  xpAmount: number;
  onComplete?: () => void;
}

export function XPCelebration({ show, xpAmount, onComplete }: XPCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: -(Math.random() * 200 + 100),
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[9998] flex items-center justify-center">
          {/* Floating XP Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: -60 }}
            exit={{ opacity: 0, y: -120 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl"
          >
            +{xpAmount} XP
          </motion.div>

          {/* Confetti Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                opacity: 1, 
                x: 0, 
                y: 0, 
                scale: 0,
                rotate: 0 
              }}
              animate={{ 
                opacity: 0, 
                x: p.x, 
                y: p.y,
                scale: 1,
                rotate: p.rotation 
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut" 
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
