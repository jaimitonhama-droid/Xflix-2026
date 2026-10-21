"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn, LogOut, Film } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { createClient } from "@/services/supabase/client";
import { gerarLinkSuporte } from "@/lib/whatsapp";

export function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    }).catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!pathname || pathname === "/" || pathname === "" || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      <nav className="w-full bg-[#08080c]/95 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/videos" className="flex items-center gap-2 group">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 group-hover:opacity-90 transition-opacity">
                VIP CONTENT
              </span>
            </Link>
          </div>

          {/* Center: "WHATSAPP STORE" */}
          <div className="hidden md:flex items-center gap-2 text-zinc-400 text-xs font-bold tracking-[0.25em] uppercase select-none">
            WHATSAPP STORE
          </div>

          {/* Right: Search, Botão Entrar e Menu dos 3 traços */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-28 sm:w-56 bg-[#121118] border border-zinc-800 focus:border-purple-500/60 text-xs text-white placeholder:text-zinc-500 px-3 py-2 rounded-xl outline-none transition-all"
              />
            </div>

            {/* Desktop: Apenas "Entrar" (ou "Sair" se autenticado) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800/80 hover:border-zinc-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-bold text-zinc-200 hover:text-white bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/60 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button (3 traços) */}
            <button
              className="md:hidden text-zinc-300 hover:text-white p-2 rounded-lg bg-zinc-900/60 border border-zinc-800"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-zinc-300" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Menu dos 3 traços) */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[170] h-full w-80 max-w-[85vw]",
          "bg-[#0e0e14] border-l border-zinc-800/90",
          "flex flex-col pt-6 pb-8 px-5",
          "transition-transform duration-300 ease-out md:hidden shadow-2xl overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Topo do Drawer */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-800/80 mb-5">
          <Link href="/videos" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              VIP CONTENT
            </span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links Principais */}
        <div className="flex flex-col gap-2">
          <Link
            href="/videos"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-sm font-bold text-zinc-200 transition-all border border-zinc-800/60"
          >
            <Film className="w-4 h-4 text-purple-400" />
            <span>Catálogo VIP</span>
          </Link>
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 text-sm font-semibold text-zinc-300 transition-all border border-zinc-800/40"
          >
            <span className="text-base">👑</span>
            <span>Perfil da Modelo</span>
          </Link>
          <a
            href={gerarLinkSuporte()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-sm font-bold text-[#00a8e8] transition-all border border-zinc-800/60"
          >
            <svg className="w-4 h-4 fill-[#00a8e8]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp Suporte</span>
          </a>
        </div>

        {/* ─── APENAS O BOTÃO "ENTRAR" (OU "SAIR") — NENHUMA MENÇÃO A ADMIN ─── */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col gap-2.5">
          {user ? (
            <button
              onClick={() => {
                setIsMobileOpen(false);
                handleSignOut();
              }}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm hover:text-white transition-all text-left"
            >
              <LogOut className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Sair</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-sm hover:text-white hover:bg-zinc-800 transition-all"
            >
              <LogIn className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
