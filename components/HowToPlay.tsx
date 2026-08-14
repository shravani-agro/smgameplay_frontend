"use client";

import { motion } from "framer-motion";
import { HelpCircle, TrendingUp, Wallet, UserCheck } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "1. Create Account",
    description:
      "Sign up using your mobile number or email. Complete the KYC process to get verified instantly.",
  },
  {
    icon: Wallet,
    title: "2. Add Funds",
    description:
      "Deposit using UPI, bank transfer, or any supported payment method. Start playing with as little as ₹500.",
  },
  {
    icon: TrendingUp,
    title: "3. Place Your Bid",
    description:
      "Choose your numbers, pick the market, and place your bid before the cutoff time. Simple and fast.",
  },
  {
    icon: HelpCircle,
    title: "4. Win & Withdraw",
    description:
      "Check results in real-time. Winnings are credited instantly. Withdraw to your bank anytime.",
  },
];

export default function HowToPlay() {
  return (
    <section className="relative mesh-bg py-20 sm:py-24 lg:py-28">
      {/* Subtle radial overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.03),transparent_60%)]" />

      {/* Smooth fade strip at bottom to blend into next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-black/10 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-400"
          >
            How It Works
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Play in <span className="bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">4 Simple Steps</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg"
          >
            Getting started on SMGameplay takes less than a minute. Follow these
            simple steps to begin your winning journey.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-7">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex h-full flex-col items-center text-center"
              >
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 shadow-[0_0_25px_rgba(225,29,72,0.12)] transition-all duration-500 group-hover:border-brand-400/40 group-hover:bg-brand-500/20 group-hover:shadow-[0_0_30px_rgba(225,29,72,0.2)] group-hover:scale-110">
                  <Icon className="h-7 w-7 text-brand-400 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
