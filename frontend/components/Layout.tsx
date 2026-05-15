import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const isHome = router.pathname === "/";

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050914]/70 backdrop-blur-2xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-lg" />
              <div className="relative h-11 w-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-300 via-indigo-500 to-cyan-400" />
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">
                <span className="text-gradient">LearnPath</span>
                <span className="text-white/80"> AI</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-white/35 mt-1">
                Adaptive roadmap
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-xl">
            {[
              { href: isHome ? "#features" : "/", label: "Features" },
              { href: isHome ? "#how-it-works" : "/", label: "How it works" },
              { href: "/quiz", label: "Quiz" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  router.pathname === "/quiz" && item.href === "/quiz"
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs uppercase tracking-[0.24em] text-white/30">
                Planning Engine
              </div>
              <div className="text-sm text-white/70">
                Quiz to path in minutes
              </div>
            </div>
            {token ? (
              <Link
                href="/quiz"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Open Workspace
              </Link>
            ) : (
              <Link
                href="/quiz"
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/85 text-sm font-medium hover:bg-white/10 hover:border-indigo-500/30 transition-all"
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
