"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/components/ui";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "bg-black/40 backdrop-blur-md border-b border-white/5 py-2 shadow-card" : "bg-transparent py-4"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 transition-transform hover:scale-105">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-lg leading-none">SM</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              SM<span className="text-brand-400">Gameplay</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 justify-end items-center gap-4">
          <Link href="/login" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <a
            href="https://github.com/harryongit/smgameplay_frontend/releases/latest/download/smgameplay.apk"
            className="group flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:scale-105 ring-1 ring-white/10 hover:ring-white/20"
          >
            <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="hidden sm:inline">Download</span> App
          </a>
        </div>
      </nav>
    </header>
  );
}
