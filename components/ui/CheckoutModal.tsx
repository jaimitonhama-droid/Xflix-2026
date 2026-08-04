"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Loader2, Lock } from "lucide-react";
import { processCheckout } from "@/app/checkout/actions";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  paymentType: "buy" | "rent";
  price: number;
  title: string;
};

export function CheckoutModal({ isOpen, onClose, videoId, paymentType, price, title }: CheckoutModalProps) {
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"mpesa" | "emola">("mpesa");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMsg("");
    const res = await processCheckout(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#0d0d10] border border-zinc-800/80 rounded-[2.5rem] w-full max-w-md shadow-2xl p-7 sm:p-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden space-y-6">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-zinc-800/80 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {paymentType === "buy" ? "Comprar Vídeo +18" : "Alugar por 24h"}
          </h2>
          <p className="text-zinc-400 text-xs font-medium truncate max-w-xs mx-auto">
            {title}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="videoId" value={videoId} />
          <input type="hidden" name="paymentType" value={paymentType} />

          {/* Resumo do Valor */}
          <div className="text-center py-1 space-y-1">
            <span className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Total a pagar</span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-4xl font-black text-white tracking-tight">{price}</span>
              <span className="text-base font-bold text-red-500">MT</span>
            </div>
          </div>

          {/* Seleção de Operadora com os LOGOS OFICIAIS */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block text-center uppercase tracking-wider">
              Selecione a Operadora
            </label>
            <div className="grid grid-cols-2 gap-4">
              
              <button
                type="button"
                onClick={() => setMethod("mpesa")}
                className={`py-3 px-3 rounded-2xl border-2 flex items-center justify-start gap-3 transition-all ${
                  method === "mpesa" 
                    ? "border-red-600 bg-red-600/10 shadow-[0_0_20px_rgba(220,38,38,0.25)]" 
                    : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 opacity-60"
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700 shadow-sm bg-red-600">
                  <img src="/images/mpesa.png" alt="M-Pesa / Vodacom" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white leading-none">M-PESA</p>
                  <p className="text-[10px] text-zinc-400 leading-tight mt-1">84 / 85</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("emola")}
                className={`py-3 px-3 rounded-2xl border-2 flex items-center justify-start gap-3 transition-all ${
                  method === "emola" 
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.25)]" 
                    : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 opacity-60"
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700 shadow-sm bg-orange-500">
                  <img src="/images/emola.png" alt="e-Mola / Movitel" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white leading-none">e-MOLA</p>
                  <p className="text-[10px] text-zinc-400 leading-tight mt-1">86 / 87</p>
                </div>
              </button>

            </div>
          </div>

          {/* Input Número */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block text-left ml-1">
              Número do Telemóvel
            </label>
            <div className="relative">
              <input 
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder={method === "mpesa" ? "Ex: 841234567" : "Ex: 861234567"}
                required
                className="w-full bg-zinc-900/90 border border-zinc-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-red-500 transition-colors font-bold text-lg tracking-wider placeholder:text-zinc-600 placeholder:font-normal placeholder:tracking-normal"
              />
              <Smartphone className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-zinc-500 text-center font-medium">
              Receberá uma notificação no telemóvel para introduzir o seu PIN.
            </p>
          </div>

          {/* Botão de Pagar */}
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-base py-4.5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || phone.length < 9}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>A processar...</span>
              </>
            ) : (
              `Pagar ${price} MT via ${method === "mpesa" ? "M-Pesa" : "e-Mola"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
