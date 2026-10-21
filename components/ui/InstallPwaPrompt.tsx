"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, X } from "lucide-react";

export function InstallPwaPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verificar se já está rodando como app instalado
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (!pathname || pathname === "/" || isStandalone || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[150] max-w-sm bg-[#121118]/95 border border-purple-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
          <Download className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-white">Instalar App Xflix</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Adicione à tela inicial do seu celular para acesso rápido e em tela cheia!
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-[#00a2ff] hover:bg-[#0091ea] text-white text-xs font-black py-2 px-3 rounded-xl transition-all shadow-[0_2px_12px_rgba(0,162,255,0.3)] active:scale-95"
            >
              Instalar Agora
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2 px-3 rounded-xl transition-colors active:scale-95"
            >
              Agora Não
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-zinc-500 hover:text-white p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
