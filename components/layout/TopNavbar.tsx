"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export function TopNavbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);
  
  // Não renderizar a Navbar nas rotas de admin ou login/register
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <>
      <nav className="w-full bg-[#050505]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-black tracking-tighter text-red-600 group-hover:scale-110 transition-transform duration-300">X</span>
              <span className="text-2xl font-black tracking-tighter text-white group-hover:text-zinc-200 transition-colors">FLIX</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Início</Link>
              <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Em Alta</Link>
            </div>
          </div>

          {/* Right: Search, Auth & Mobile Menu */}
          <div className="flex items-center gap-4 md:gap-6">
            <SearchBar />
            
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
              <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="text-sm font-semibold bg-white !text-zinc-950 hover:bg-zinc-200 px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                Criar Conta
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-zinc-400 hover:text-white p-2"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-72",
          "bg-[#111115] border-l border-zinc-800/80",
          "flex flex-col pt-6 pb-8 px-5",
          "transition-transform duration-300 ease-out md:hidden shadow-2xl",
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-xl font-black tracking-tighter text-red-600">X</span>
            <span className="text-xl font-black tracking-tighter text-white">FLIX</span>
          </Link>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 mb-8">
          <Link
            href="/"
            className="px-4 py-3 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            Início
          </Link>
          <Link
            href="#"
            className="px-4 py-3 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            Em Alta
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-zinc-800">
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-zinc-700 bg-zinc-900/50 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white text-zinc-950 text-sm font-black hover:bg-zinc-200 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Criar Conta Grátis
          </Link>
        </div>
      </div>
    </>
  );
}
