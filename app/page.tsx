import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen mesh-bg relative selection:bg-brand-500/30 overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>

      {/* Simple Footer */}
      <footer className="relative mt-24 border-t border-white/10 py-10 text-center bg-black/20 backdrop-blur-md">
        <p className="text-sm font-medium text-slate-500">
          © {new Date().getFullYear()} SMGameplay Booking. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
