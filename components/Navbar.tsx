"use client";

import Link from "next/link";
import { Download } from "lucide-react";

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-white font-bold leading-none">SM</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              SMGameplay
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 justify-end items-center gap-4">
          <Link href="/login" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <a
            href="https://github.com/harryongit/game_app/releases/latest/download/realspinpro.apk"
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span> App
          </a>
        </div>
      </nav>
    </header>
  );
}
