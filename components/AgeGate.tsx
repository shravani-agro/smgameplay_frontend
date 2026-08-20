"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgeGate() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const verified = localStorage.getItem("ageVerified");
    if (verified !== "true") {
      setShow(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-ink-950/90 backdrop-blur-md px-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-ink-850 rounded-2xl shadow-glow p-8 max-w-md w-full text-center border border-ink-700/50 relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-600/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-6 border border-brand-500/30">
                <svg className="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              
              <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Age Verification</h2>
              <p className="text-gray-300 mb-8 font-medium leading-relaxed">
                You must be at least 18 years old to access this website. Are you 18 or older?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    localStorage.setItem("ageVerified", "true");
                    setShow(false);
                  }}
                  className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:ring-4 focus:ring-brand-500/50"
                >
                  Yes, I am 18+
                </button>
                <button
                  onClick={() => {
                    window.location.href = "https://www.google.com";
                  }}
                  className="flex-1 bg-ink-700 hover:bg-ink-600 text-gray-200 font-bold py-3.5 px-6 rounded-xl border border-ink-600 shadow-md transition-all duration-300"
                >
                  No, Exit
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-6 max-w-[90%] mx-auto">
                By clicking "Yes", you confirm that you are of legal age to participate in online gaming activities in your jurisdiction.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
