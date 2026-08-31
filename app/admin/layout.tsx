"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Open the sidebar by default on mobile if the user is on the root /admin path
    if (pathname === "/admin" && window.innerWidth < 768) {
      setIsMobileMenuOpen(true);
    } else {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  // TESTE HABILITADO: Verificação de segurança suspensa temporariamente para você poder testar o visual!
  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100 overflow-hidden relative">
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto bg-[#09090b] px-3 py-4 sm:p-4 md:p-8 lg:p-10 w-full relative">
        <div className="max-w-7xl mx-auto">
          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-white/5">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center shadow-lg">
                 <span className="text-white font-black text-sm">X</span>
               </div>
               <span className="text-base font-black text-white tracking-wider">XFLIX ADMIN</span>
             </div>
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-white flex items-center gap-2 hover:bg-zinc-800 transition-colors"
             >
               <Menu className="w-5 h-5" />
             </button>
          </div>
          <AdminHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
