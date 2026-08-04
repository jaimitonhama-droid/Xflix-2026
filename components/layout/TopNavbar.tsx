"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const pathname = usePathname();
  
  // Não renderizar a Navbar nas rotas de admin ou login/register
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
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
          <button className="md:hidden text-zinc-400 hover:text-white p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
