"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
}

let toastCount = 0;
type ToastObserver = (toasts: ToastProps[]) => void;
let observers: ToastObserver[] = [];
let currentToasts: ToastProps[] = [];

function emitChange() {
  observers.forEach((o) => o(currentToasts));
}

export const toast = {
  success: (message: string) => addToast("success", message),
  error: (message: string) => addToast("error", message),
  info: (message: string) => addToast("info", message),
};

function addToast(type: ToastType, message: string) {
  const id = `toast-${++toastCount}`;
  currentToasts = [...currentToasts, { id, type, message }];
  emitChange();
  setTimeout(() => {
    removeToast(id);
  }, 4000);
}

function removeToast(id: string) {
  currentToasts = currentToasts.filter((t) => t.id !== id);
  emitChange();
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    observers.push(setToasts);
    setToasts(currentToasts);
    return () => {
      observers = observers.filter((o) => o !== setToasts);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl border ${
              t.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/20 text-emerald-300"
                : t.type === "error"
                ? "bg-red-950/80 border-red-500/20 text-red-300"
                : "bg-ink-950/80 border-white/20 text-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
               {t.type === "success" && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)]">✓</div>}
               {t.type === "error" && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs shadow-[0_0_10px_rgba(239,68,68,0.3)]">✕</div>}
               {t.type === "info" && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 text-xs shadow-[0_0_10px_rgba(139,92,246,0.3)]">i</div>}
               <span className="text-sm font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
