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
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-400">Play Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to win big
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Join thousands of players who trust SMGameplay for their daily entertainment and rewards.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 ring-1 ring-brand-500/30">
                    <feature.icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
