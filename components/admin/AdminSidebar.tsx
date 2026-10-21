"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, CreditCard, BarChart3, Settings, LogOut, Sparkles } from "lucide-react";

export function AdminSidebar({ isOpen = false, onClose = () => {} }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const links = [
    { name: "Início", href: "/admin", icon: LayoutDashboard },
    { name: "Página Inicial", href: "/admin/landing", icon: Sparkles },
    { name: "Vídeos", href: "/admin/videos", icon: Film },
    { name: "Transações", href: "/admin/transactions", icon: CreditCard },
    { name: "Usuários", href: "/admin/users", icon: BarChart3 },
    { name: "Configurações", href: "/admin/settings", icon: Settings }, // Adicionado ao menu principal para mobile
  ];

  const handleLogout = async () => {
    const { createClient } = await import("@/services/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* ═══════════════ DESKTOP SIDEBAR ═══════════════ */}
      <aside className={`hidden md:flex inset-y-0 left-0 z-50 w-64 bg-[#0a0a0d] border-r border-zinc-800/60 min-h-screen flex-col flex-shrink-0 select-none transition-transform duration-300 ease-in-out md:translate-x-0 static`}>
        <div className="p-6 overflow-y-auto flex-1">
          {/* Brand Header */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white tracking-wider">XFLIX</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded">Admin</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">Painel de Gestão</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Menu Principal</p>
            {links.filter(link => link.name !== "Configurações").map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
              
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                    isActive 
                      ? "bg-red-500/10 text-red-500 font-bold" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                  <span>{link.name === "Início" ? "Dashboard" : link.name === "Usuários" ? "Estatísticas" : link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto p-6 border-t border-zinc-900 space-y-1 bg-[#0a0a0d]">
          <p className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Definições</p>
          <Link href="/admin/settings" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm text-zinc-400 hover:text-white hover:bg-zinc-900/60">
            <Settings className="w-4 h-4 text-zinc-400" />
            Configurações
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm text-red-400/90 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ═══════════════ MOBILE BOTTOM NAV ═══════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/80 bg-zinc-950/98 backdrop-blur-xl pb-safe">
        <div className="flex items-stretch h-[64px]">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${
                  isActive ? "text-white" : "text-zinc-500 hover:text-zinc-400"
                }`}
              >
                {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-b-full" />}
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : ''}`} />
                <span className="text-[9px] font-semibold tracking-wide leading-none truncate w-full text-center px-1">
                  {link.name === "Transações" ? "Financeiro" : link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
