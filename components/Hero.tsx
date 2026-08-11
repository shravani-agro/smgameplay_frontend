"use client";

import { motion } from "framer-motion";
import { Download, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-20 lg:pt-32 lg:pb-32">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Animated glowing orbs */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[120px] mix-blend-screen animate-pulse-glow" />
      <div className="absolute top-3/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[100px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex justify-center"
          >
            <div className="group relative rounded-full px-5 py-2 text-sm leading-6 text-brand-300 ring-1 ring-brand-500/30 hover:ring-brand-500/50 bg-brand-500/10 backdrop-blur-md transition-all hover:bg-brand-500/20 cursor-pointer overflow-hidden shadow-glow">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-brand-400 animate-pulse" />
                <span className="font-medium text-white tracking-wide">Trusted by 10,000+ top players globally</span>
                <ChevronRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-[5.5rem] leading-[1.1]"
          >
            Elevate Your <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              Gaming Experience
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg leading-8 text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Experience the thrill of the most secure and fast-paced gaming platform. Instant withdrawals, 24/7 support, and unparalleled rewards await you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://github.com/shravani-agro/smgameplay_frontend/releases/latest/download/smgameplay.apk"
              className="group relative flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(225,29,72,0.4)] transition-all hover:bg-brand-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(225,29,72,0.6)] w-full sm:w-auto"
            >
              <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
              Download App Now
              <div className="absolute inset-0 rounded-full border border-white/20" />
            </a>


          </motion.div>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute left-10 bottom-20 hidden lg:block animate-float" style={{ animationDelay: "0s" }}>
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-transparent backdrop-blur-xl border border-white/10 rotate-12" />
      </div>
      <div className="absolute right-20 top-40 hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent backdrop-blur-xl border border-white/10 -rotate-12" />
      </div>
    </section>
  );
}
