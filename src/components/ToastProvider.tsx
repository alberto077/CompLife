"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, Zap, Trophy } from "lucide-react";

type ToastType = "success" | "error" | "info" | "xp" | "levelup";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  xpAmount?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, xpAmount?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  xp: <Zap className="w-5 h-5 text-indigo-400" />,
  levelup: <Trophy className="w-5 h-5 text-yellow-400" />,
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: "border-emerald-500/30 bg-emerald-500/5",
  error: "border-red-500/30 bg-red-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
  xp: "border-indigo-500/30 bg-indigo-500/5",
  levelup: "border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success", xpAmount?: number) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, xpAmount }]);

    // Auto-dismiss
    const duration = type === "levelup" ? 5000 : 3500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/40 ${TOAST_STYLES[t.type]}`}
            >
              <div className="flex-shrink-0">
                {TOAST_ICONS[t.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{t.message}</p>
                {t.xpAmount && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-indigo-400 mt-0.5"
                  >
                    +{t.xpAmount} XP earned!
                  </motion.p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Auto-dismiss progress bar */}
              <motion.div
                className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-white/10 overflow-hidden"
              >
                <motion.div
                  className="h-full bg-white/30 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: t.type === "levelup" ? 5 : 3.5, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
