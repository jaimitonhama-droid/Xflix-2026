"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Loader2, Lock, CheckCircle2 } from "lucide-react";

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
  const [selectedAccess, setSelectedAccess] = useState<"24h" | "7days">("7days");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-detect operator based on phone prefix (84/85 -> M-Pesa, 86/87 -> e-Mola)
  useEffect(() => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("84") || cleanPhone.startsWith("85")) {
      setMethod("mpesa");
    } else if (cleanPhone.startsWith("86") || cleanPhone.startsWith("87")) {
      setMethod("emola");
    }
  }, [phone]);

  if (!isOpen) return null;

  const currentPrice = selectedAccess === "24h" ? 20 : 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      alert("Por favor, introduza um número de telemóvel válido com 9 dígitos.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const methodName = method === "emola" ? "e-Mola (Movitel)" : "M-Pesa (Vodacom)";
      alert(`✅ Solicitação enviada com sucesso para ${phone} via ${methodName}!\nPor favor, confirme a transação no seu telemóvel inserindo o seu PIN.`);
      if (onSuccess) onSuccess();
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      {/* Backdrop de Fundo Escuro Suave */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container Elegante e Espaçoso */}
      <div className="relative bg-[#111115] border border-zinc-800/90 rounded-[2.2rem] w-full max-w-[500px] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 space-y-6 my-auto overflow-hidden">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-zinc-800/80 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Cabeçalho Limpo */}
        <div className="text-center space-y-3 pt-1">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300 shadow-xl">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Desbloquear Vídeos
          </h2>
          
          {/* Mensagem Subtil */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 px-4 py-2 rounded-xl inline-block">
            <p className="text-xs sm:text-sm font-bold text-zinc-300 tracking-tight flex items-center justify-center gap-1.5">
              <span className="text-white">Desbloqueio Imediato</span>
              <span className="text-zinc-500">•</span>
              <span>Acesso a todo catálogo VIP</span>
            </p>
          </div>
        </div>

        {/* 2. Seleção de Valor (Lista Vertical Minimalista) */}
        <div className="space-y-3">
          
          {/* Opção 20 MT - 24 Horas */}
          <div
            onClick={() => setSelectedAccess("24h")}
            className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
              selectedAccess === "24h"
                ? "bg-zinc-800/80 border-zinc-600 shadow-sm"
                : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700"
            }`}
          >
            <div className="flex flex-col text-left">
              <span className={`text-sm font-black transition-colors ${selectedAccess === "24h" ? "text-white" : "text-zinc-300"}`}>
                Acesso 24 Horas
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5">Válido por 1 dia inteiro</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-black transition-colors ${selectedAccess === "24h" ? "text-white" : "text-zinc-400"}`}>20</span>
                <span className="text-[10px] font-bold text-zinc-500">MT</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${selectedAccess === "24h" ? "border-white bg-white" : "border-zinc-700"}`}>
                {selectedAccess === "24h" && <CheckCircle2 className="w-5 h-5 text-zinc-900" />}
              </div>
            </div>
          </div>

          {/* Opção 50 MT - 7 Dias */}
          <div
            onClick={() => setSelectedAccess("7days")}
            className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${
              selectedAccess === "7days"
                ? "bg-zinc-800/80 border-zinc-600 shadow-sm"
                : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700"
            }`}
          >
            {/* Tag Mais Popular - Discreta e Alinhada */}
            <div className="absolute top-0 right-0 bg-zinc-700/50 px-3 py-1 rounded-bl-xl text-[9px] font-bold text-zinc-300 uppercase tracking-wider">
              Popular
            </div>

            <div className="flex flex-col text-left pt-1">
              <span className={`text-sm font-black transition-colors ${selectedAccess === "7days" ? "text-white" : "text-zinc-300"}`}>
                Acesso 7 Dias
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5">Válido por uma semana inteira</span>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-black transition-colors ${selectedAccess === "7days" ? "text-white" : "text-zinc-400"}`}>50</span>
                <span className="text-[10px] font-bold text-zinc-500">MT</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${selectedAccess === "7days" ? "border-white bg-white" : "border-zinc-700"}`}>
                {selectedAccess === "7days" && <CheckCircle2 className="w-5 h-5 text-zinc-900" />}
              </div>
            </div>
          </div>

        </div>

        {/* 3. Formulário de Pagamento */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Seleção da Operadora (Lista Vertical Minimalista) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 block text-left ml-1 uppercase tracking-wider">
              Método de Pagamento
            </label>
            <div className="flex flex-col gap-2.5">
              
              {/* Opção e-Mola */}
              <button
                type="button"
                onClick={() => setMethod("emola")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                  method === "emola" 
                    ? "bg-zinc-800/80 border-zinc-600 shadow-sm" 
                    : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-orange-500 flex items-center justify-center p-0.5 shadow-sm">
                    <img src="/images/emola.png" alt="e-Mola / Movitel" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <span className={`text-sm font-bold transition-colors ${method === "emola" ? "text-white" : "text-zinc-300"}`}>
                    e-Mola <span className="font-medium text-zinc-500">(Movitel)</span>
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${method === "emola" ? "border-white bg-white" : "border-zinc-700"}`}>
                  {method === "emola" && <CheckCircle2 className="w-5 h-5 text-zinc-900" />}
                </div>
              </button>

              {/* Opção M-Pesa */}
              <button
                type="button"
                onClick={() => setMethod("mpesa")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                  method === "mpesa" 
                    ? "bg-zinc-800/80 border-zinc-600 shadow-sm" 
                    : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-red-600 flex items-center justify-center p-0.5 shadow-sm">
                    <img src="/images/mpesa.png" alt="M-Pesa / Vodacom" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <span className={`text-sm font-bold transition-colors ${method === "mpesa" ? "text-white" : "text-zinc-300"}`}>
                    M-Pesa <span className="font-medium text-zinc-500">(Vodacom)</span>
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${method === "mpesa" ? "border-white bg-white" : "border-zinc-700"}`}>
                  {method === "mpesa" && <CheckCircle2 className="w-5 h-5 text-zinc-900" />}
                </div>
              </button>

            </div>
          </div>

          {/* Campo do Número de Telemóvel Limpo sem Bugs de Ícone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block text-left ml-1">
              Número do Telemóvel
            </label>
            <div className="relative">
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder={method === "emola" ? "Ex: 861234567" : "Ex: 841234567"}
                required
                className="w-full bg-zinc-900/90 border border-zinc-800 text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-red-500 transition-colors font-bold text-sm tracking-wider placeholder:text-zinc-600 placeholder:font-normal placeholder:tracking-normal"
              />
              <Smartphone className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-xs text-zinc-400 text-center font-medium mt-3">
              Confirme a transação digitando o seu PIN no telemóvel após clicar no botão.
            </p>
          </div>

          {/* Botão de Efetuar Pagamento (Estilo Premium Branco) */}
          <button 
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm py-4 rounded-2xl transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-zinc-950" />
                <span>A aguardar PIN no telemóvel...</span>
              </>
            ) : (
              `Efetuar Pagamento (${currentPrice} MT)`
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
