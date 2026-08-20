"use client";

import Link from "next/link";
import { Mail, ShieldCheck, Lock } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="w-full bg-[#0d0d10] border-t border-zinc-800/80 mt-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Marca e Pagamentos */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-2xl font-black tracking-tighter text-white">X</span>
              <span className="text-2xl font-black tracking-tighter text-red-600">FLIX</span>
              <span className="ml-2 bg-red-600/20 text-red-500 text-[10px] font-black px-1.5 py-0.5 rounded border border-red-500/30">18+</span>
            </Link>
            
            {/* Logos Oficiais M-Pesa / e-Mola no Rodapé */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-8 bg-zinc-900 border border-zinc-800 px-2.5 rounded-lg flex items-center gap-2">
                <img src="/images/mpesa.png" alt="M-Pesa" className="h-5 w-5 rounded object-cover" />
                <span className="text-[10px] font-bold text-white">M-PESA</span>
              </div>
              <div className="h-8 bg-zinc-900 border border-zinc-800 px-2.5 rounded-lg flex items-center gap-2">
                <img src="/images/emola.png" alt="e-Mola" className="h-5 w-5 rounded object-cover" />
                <span className="text-[10px] font-bold text-white">e-MOLA</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-4 md:space-y-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="#" className="hover:text-red-400 transition-colors">Termos de Uso (+18)</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
