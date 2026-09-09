"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

type PaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  price?: number;
  onSuccess?: () => void;
};

export function PaywallModal({ isOpen, onClose, videoId, onSuccess }: PaywallModalProps) {
  const [phone, setPhone] = useState("");
  const method = "mpesa";
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      alert("Por favor, introduza um número válido.");
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/payments/netshop/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, method })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Ocorreu um erro no processamento.");
      }

      alert(`✅ Solicitação enviada! Confirme no telemóvel.`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert("Erro: " + (err.message || "Falha na comunicação com o servidor."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      
      {/* Quadro principal com largura máxima controlada */}
      <div className="relative bg-[#18181b] rounded-2xl w-full max-w-[320px] p-6 shadow-2xl border border-zinc-800">
        
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-900 rounded-full p-1">
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-5 mt-2">
          <h2 className="text-3xl font-black text-white">25 MT</h2>
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mt-1">
            VIP 7 DIAS
          </p>
          <p className="text-xs text-zinc-300 mt-3 leading-snug px-1">
            Ao pagar este valor único, você poderá assistir a TODOS os vídeos da plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Método Único de Pagamento */}
          <div className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl border-2 transition-colors bg-red-600/10 border-red-600">
            <img src="/images/mpesa.png" alt="M-Pesa" className="w-8 h-8 rounded-md" />
            <span className="text-sm font-bold text-red-500">M-Pesa</span>
          </div>

          {/* Campo de Número (Texto Mais Claro e Maior) */}
          <div className="flex flex-col gap-2 text-center mt-1">
            <label className="text-xs text-zinc-300 font-bold uppercase block text-center">
              Número de Telemóvel
            </label>
            <div className="relative flex items-center bg-[#27272a] border-2 border-zinc-700 rounded-xl focus-within:border-red-500 overflow-hidden">
              <span className="pl-4 pr-0 text-white font-bold text-base tracking-widest">+258</span>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                required
                className="w-full bg-transparent text-white py-3.5 text-base font-bold tracking-widest outline-none placeholder:text-zinc-500 placeholder:font-normal placeholder:tracking-normal"
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-snug">
              Irá receber um pop-up no telemóvel para introduzir o PIN.
            </p>
          </div>

          {/* Botão Pagar */}
          <button 
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50 mt-1"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pagar Agora"}
          </button>
          
        </form>
      </div>
    </div>
  );
}
