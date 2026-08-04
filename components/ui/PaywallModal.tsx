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
          <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Desbloquear Vídeos
          </h2>
          
          {/* Mensagem Chamativa em Destaque */}
          <div className="bg-gradient-to-r from-red-950/60 via-red-900/40 to-red-950/60 border border-red-500/30 px-3.5 py-2 rounded-xl inline-block shadow-md">
            <p className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>🔥</span>
              <span className="text-red-400 font-extrabold">20 MT – 50 MT</span>
              <span className="text-zinc-200">: Acesso Total a TODOS os Vídeos!</span>
            </p>
          </div>
        </div>

        {/* 2. Seleção de Valor (20 MT 24h / 50 MT 7dias) com Espaçamento Limpo */}
        <div className="grid grid-cols-2 gap-3.5">
          
          {/* Opção 20 MT - 24 Horas */}
          <div
            onClick={() => setSelectedAccess("24h")}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
              selectedAccess === "24h"
                ? "border-red-600 bg-red-600/10 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                : "border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 opacity-70"
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Acesso 24h</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">20</span>
                <span className="text-xs font-bold text-red-500">MT</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium mt-2">24 Horas de Acesso</p>
          </div>

          {/* Opção 50 MT - 7 Dias */}
          <div
            onClick={() => setSelectedAccess("7days")}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between overflow-hidden ${
              selectedAccess === "7days"
                ? "border-red-600 bg-red-600/15 shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                : "border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 opacity-70"
            }`}
          >
            <div className="absolute top-0 right-0 bg-red-600 px-2 py-0.5 rounded-bl-lg text-[8px] font-black text-white uppercase tracking-widest">
              Popular
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">Acesso 7 Dias</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">50</span>
                <span className="text-xs font-bold text-red-500">MT</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium mt-2">7 Dias de Acesso</p>
          </div>

        </div>

        {/* 3. Formulário de Pagamento */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Seleção da Operadora (e-Mola e M-Pesa) com Logos Oficiais Limpos */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block text-center uppercase tracking-wider">
              Selecione o Método de Pagamento
            </label>
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Opção e-Mola (Movitel) */}
              <button
                type="button"
                onClick={() => setMethod("emola")}
                className={`py-3 px-3.5 rounded-2xl border-2 flex items-center justify-start gap-3 transition-all ${
                  method === "emola" 
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                    : "border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 opacity-60"
                }`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700/80 shadow-sm bg-orange-500">
                  <img src="/images/emola.png" alt="e-Mola / Movitel" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white leading-none">e-MOLA</p>
                  <p className="text-[10px] text-zinc-400 leading-tight mt-1">86 / 87</p>
                </div>
              </button>

              {/* Opção M-Pesa (Vodacom) */}
              <button
                type="button"
                onClick={() => setMethod("mpesa")}
                className={`py-3 px-3.5 rounded-2xl border-2 flex items-center justify-start gap-3 transition-all ${
                  method === "mpesa" 
                    ? "border-red-600 bg-red-600/10 shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
                    : "border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 opacity-60"
                }`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700/80 shadow-sm bg-red-600">
                  <img src="/images/mpesa.png" alt="M-Pesa / Vodacom" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white leading-none">M-PESA</p>
                  <p className="text-[10px] text-zinc-400 leading-tight mt-1">84 / 85</p>
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
                className="w-full bg-zinc-900/90 border border-zinc-800 text-white rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-red-500 transition-colors font-bold text-sm tracking-wider placeholder:text-zinc-600 placeholder:font-normal placeholder:tracking-normal"
              />
              <Smartphone className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-zinc-500 text-center font-medium">
              Confirme a transação digitando o seu PIN no telemóvel.
            </p>
          </div>

          {/* Botão de Efetuar Pagamento */}
          <button 
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>A aguardar PIN...</span>
              </>
            ) : (
              `Efetuar Pagamento de ${currentPrice} MT`
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
