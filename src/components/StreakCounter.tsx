"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  streakDays: number;
}

export function StreakCounter({ streakDays }: StreakCounterProps) {
  const isActive = streakDays > 0;
  const isMilestone = [7, 14, 30, 60, 100, 365].includes(streakDays);

  return (
    <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4 relative overflow-hidden">
      {/* Glow effect for active streaks */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-8 -translate-y-1/2 w-16 h-16 rounded-full bg-orange-500/20 blur-xl" />
        </div>
      )}

      <div className="relative">
        <motion.div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isActive
              ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
              : "bg-neutral-800 border border-white/5"
          }`}
          animate={isActive ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Flame className={`w-6 h-6 ${isActive ? "text-orange-400" : "text-neutral-600"}`} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="text-sm font-medium text-neutral-400">
          {isActive ? "Current Streak" : "No Active Streak"}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${isActive ? "text-orange-400" : "text-neutral-600"}`}>
            {streakDays}
          </span>
          <span className="text-sm text-neutral-400">
            {streakDays === 1 ? "day" : "days"}
          </span>
          {isMilestone && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full"
            >
              🎉 Milestone!
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
