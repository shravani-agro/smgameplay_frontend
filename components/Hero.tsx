"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Decorative gradients */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-500/20 blur-[128px]" />
      <div className="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[128px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-brand-300 ring-1 ring-white/10 hover:ring-white/20">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-brand-400" />
                Trusted by 10,000+ players
              </span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
          >
            Play & Win with <br />
            <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              SMGameplay
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-300"
          >
            Experience the thrill of the most secure and fast-paced gaming platform. Instant withdrawals, 24/7 support, and unparalleled rewards await you.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <a
              href="https://github.com/harryongit/game_app/releases/latest/download/realspinpro.apk"
              className="group flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-500 hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Download App
            </a>
            <Link
              href="/admin"
              className="group flex items-center gap-2 text-sm font-semibold leading-6 text-white transition-colors hover:text-brand-300"
            >
              Admin Login <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
