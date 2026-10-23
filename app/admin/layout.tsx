"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Ao navegar entre rotas, fecha o menu automaticamente
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100 overflow-hidden relative">
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto bg-[#09090b] px-3 py-4 sm:p-4 md:p-8 lg:p-10 w-full relative pb-24 md:pb-8 lg:pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header (Hidden since we have bottom nav now, but keeping title is good) */}
          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-white/5">
             <div className="flex items-center gap-2">
               <span className="text-base font-black text-white tracking-wider">XFLIX</span>
               <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded">Admin</span>
             </div>
             {/* Removed Menu button as navigation is now at the bottom */}
          </div>
          <AdminHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
