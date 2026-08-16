"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-slate-200/50">
      {/* Full-width video */}
      <div className="relative w-full">
         <video
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          className="w-full h-[280px] object-cover block"
        >
          <source src="/CTA.mp4" type="video/mp4" />
        </video>

      {/* Smooth fade from theme background into video at the top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40
          bg-gradient-to-b from-[#fdfbf7] via-[#fdfbf7]/60 to-transparent"
        />

        {/* Smooth fade from video into dark footer at the bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40
          bg-gradient-to-t from-black via-black/60 to-transparent"
        />
      </div>

      {/* Footer content */}
      <div className="border-t border-white/5 bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            2026 Satta Matka. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Terms
            </Link>

            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Privacy
            </Link>

            <Link
              href="/support"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}