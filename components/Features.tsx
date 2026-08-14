"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  HeadphonesIcon,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    name: "Instant Withdrawals",
    description:
      "Get your winnings instantly into your bank account. No waiting, no hidden fees.",
    icon: Zap,
  },
  {
    name: "100% Secure",
    description:
      "End-to-end encryption and trusted payment gateways ensure your money is always safe.",
    icon: ShieldCheck,
  },
  {
    name: "Real-time Results",
    description:
      "Stay ahead with lightning-fast, accurate market results updated in real time.",
    icon: TrendingUp,
  },
  {
    name: "24/7 Support",
    description:
      "Our dedicated team is available around the clock to assist you with any questions.",
    icon: HeadphonesIcon,
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/[0.04] blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.06),transparent_65%)]" />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-black/10 to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
              Play Smarter
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              win big
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
          >
            Join thousands of players who trust SMGameplay Booking for their
            daily entertainment and rewards.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-12 sm:mt-16 lg:mt-20">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative h-full"
                >
                  {/* Outer glow */}
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-brand-500/20 via-transparent to-transparent opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Card */}
                  <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-brand-500/30 group-hover:bg-slate-900/80 group-hover:shadow-[0_20px_50px_rgba(225,29,72,0.12)] sm:p-8">
                    {/* Card gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top shine */}
                    <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 shadow-[0_0_25px_rgba(225,29,72,0.12)] transition-all duration-500 group-hover:border-brand-400/40 group-hover:bg-brand-500/20 group-hover:shadow-[0_0_30px_rgba(225,29,72,0.2)]">
                        <Icon
                          className="h-7 w-7 text-brand-400 transition-transform duration-500 group-hover:scale-110"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Title */}
                      <dt className="mt-7 text-lg font-bold leading-7 text-white sm:text-xl">
                        {feature.name}
                      </dt>

                      {/* Description */}
                      <dd className="mt-3 text-sm leading-6 text-slate-400 transition-colors duration-300 group-hover:text-slate-300 sm:text-base sm:leading-7">
                        {feature.description}
                      </dd>
                    </div>

                    {/* Bottom accent */}
                    <div className="relative z-10 mt-auto pt-8">
                      <div className="h-px w-0 bg-gradient-to-r from-brand-500 to-transparent transition-all duration-500 group-hover:w-full" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}