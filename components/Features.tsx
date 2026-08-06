"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeadphonesIcon, TrendingUp } from "lucide-react";

const features = [
  {
    name: "Instant Withdrawals",
    description: "Get your winnings instantly into your bank account. No waiting, no hidden fees.",
    icon: Zap,
  },
  {
    name: "100% Secure",
    description: "End-to-end encryption and trusted payment gateways ensure your money is always safe.",
    icon: ShieldCheck,
  },
  {
    name: "Real-time Results",
    description: "Stay ahead with lightning-fast, accurate market results updated in real time.",
    icon: TrendingUp,
  },
  {
    name: "24/7 Support",
    description: "Our dedicated team is available around the clock to assist you with any questions.",
    icon: HeadphonesIcon,
  },
];

export default function Features() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Decorative ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.05),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-bold uppercase tracking-widest text-brand-400"
          >
            Play Smarter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">win big</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-400"
          >
            Join thousands of players who trust SMGameplay Booking for their daily entertainment and rewards.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl p-8 shadow-card ring-1 ring-white/10 bg-ink-900/60 backdrop-blur-xl transition-all hover:bg-ink-800/80 hover:ring-white/20 hover:-translate-y-2 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-500/0 to-brand-500/0 group-hover:from-brand-500/5 group-hover:to-transparent transition-all duration-500" />

                <div>
                  <dt className="flex flex-col gap-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20 ring-1 ring-brand-500/30 group-hover:ring-brand-400 group-hover:bg-brand-500/30 transition-all shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                      <feature.icon className="h-7 w-7 text-brand-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    </div>
                    <span className="text-xl font-bold leading-7 text-white mt-2">
                      {feature.name}
                    </span>
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-slate-400 group-hover:text-slate-300 transition-colors">
                    <p>{feature.description}</p>
                  </dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
