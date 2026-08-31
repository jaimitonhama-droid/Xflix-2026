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
  const [method, setMethod] = useState<"emola" | "mpesa">("emola");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("84") || cleanPhone.startsWith("85")) {
      setMethod("mpesa");
    } else if (cleanPhone.startsWith("86") || cleanPhone.startsWith("87")) {
      setMethod("emola");
    }
  }, [phone]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      alert("Por favor, introduza um número válido.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`✅ Solicitação enviada! Confirme no telemóvel.`);
      if (onSuccess) onSuccess();
      onClose();
    }, 2200);
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
          
          {/* Botões Lado a Lado (Legíveis) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod("emola")}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border-2 transition-colors ${
                method === "emola" ? "bg-orange-500/10 border-orange-500" : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              <img src="/images/emola.png" alt="e-Mola" className="w-8 h-8 rounded-md" />
              <span className={`text-sm font-bold ${method === "emola" ? "text-orange-500" : "text-zinc-300"}`}>e-Mola</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("mpesa")}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border-2 transition-colors ${
                method === "mpesa" ? "bg-red-600/10 border-red-600" : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              <img src="/images/mpesa.png" alt="M-Pesa" className="w-8 h-8 rounded-md" />
              <span className={`text-sm font-bold ${method === "mpesa" ? "text-red-500" : "text-zinc-300"}`}>M-Pesa</span>
            </button>
          </div>

          {/* Campo de Número (Texto Mais Claro e Maior) */}
          <div className="flex flex-col gap-2 text-center mt-1">
            <label className="text-xs text-zinc-300 font-bold uppercase block text-center">
              Número de Telemóvel
            </label>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder={method === "emola" ? "Ex: 861234567" : "Ex: 841234567"}
              required
              className="w-full bg-[#27272a] border-2 border-zinc-700 text-white rounded-xl text-center py-3.5 text-base font-bold tracking-widest focus:border-red-500 focus:outline-none placeholder:text-zinc-500 placeholder:font-normal placeholder:tracking-normal"
            />
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
