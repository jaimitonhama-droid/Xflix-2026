"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, CreditCard, BarChart3, Settings, LogOut, Shield } from "lucide-react";
import { createClient } from "@/services/supabase/client";

export function AdminSidebar({ isOpen = false, onClose = () => {} }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const supabase = createClient();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Vídeos", href: "/admin/videos", icon: Film },
    { name: "Transações", href: "/admin/transactions", icon: CreditCard },
    { name: "Estatísticas", href: "/admin/users", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#0a0a0d] border-r border-zinc-800/60 min-h-screen flex flex-col flex-shrink-0 select-none transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 overflow-y-auto flex-1">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.35)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all duration-300">
            <span className="text-white font-black text-lg">X</span>
          </div>
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
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={onClose}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  isActive 
                    ? "bg-red-500/10 text-red-500 font-bold" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 font-medium"
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto p-6 border-t border-zinc-900 space-y-1 bg-[#0a0a0d]">
        <p className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Definições</p>
        <Link href="/admin/settings" onClick={onClose} className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm text-zinc-400 hover:text-white hover:bg-zinc-900/60">
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
    </>
  );
}
