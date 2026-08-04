"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // TESTE HABILITADO: Verificação de segurança suspensa temporariamente para você poder testar o visual!
  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-[#09090b] p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <AdminHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
