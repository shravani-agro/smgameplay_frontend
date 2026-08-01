import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen app-bg relative selection:bg-brand-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      
      {/* Simple Footer */}
      <footer className="mt-24 border-t border-white/10 py-10 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} SMGameplay. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
