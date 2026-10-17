"use client";

import { gerarLinkSuporte } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const link = gerarLinkSuporte();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[150] flex items-center gap-2.5 bg-[#00a8e8] hover:bg-[#0096d1] text-white font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-full shadow-[0_4px_25px_rgba(0,168,232,0.45)] hover:shadow-[0_4px_35px_rgba(0,168,232,0.65)] transition-all duration-300 hover:scale-105 active:scale-95 select-none"
      aria-label="Falar no WhatsApp"
    >
      {/* Efeito sutil de pulso */}
      <span className="absolute inset-0 rounded-full bg-[#00a8e8] animate-ping opacity-25 pointer-events-none" />

      {/* Ícone de Mensagem / WhatsApp */}
      <svg
        className="w-4 h-4 fill-white flex-shrink-0 relative z-10"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.34C8.51 21.52 10.2 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
      </svg>

      <span className="relative z-10 font-bold tracking-wide">
        FALE CONNOSCO
      </span>
    </a>
  );
}
