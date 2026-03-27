"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className = "", duration = 1 }: AnimatedCounterProps) {
  const spring = useSpring(0, { 
    damping: 30, 
    stiffness: 100,
    duration: duration * 1000 
  });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());
  const [displayValue, setDisplayValue] = useState(value.toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on("change", (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [value, spring, display]);

  return (
    <motion.span 
      ref={ref}
      className={className}
      key={value}
    >
      {displayValue}
    </motion.span>
  );
}
