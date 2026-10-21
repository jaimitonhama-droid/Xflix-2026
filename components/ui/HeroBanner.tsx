"use client";

import { useState, useEffect } from "react";
import { Eye, Zap, Play, X, Film } from "lucide-react";
import { gerarLinkWhatsApp } from "@/lib/whatsapp";
import Image from "next/image";

export function HeroBanner() {
  const [mostrarPrevia, setMostrarPrevia] = useState(false);

  // Contador regressivo idêntico à imagem de referência (FLASH SALE • LIMITED TIME OFFER)
  const [tempo, setTempo] = useState({ m: 12, s: 32 });

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo((prev) => {
        if (prev.s > 0) {
          return { ...prev, s: prev.s - 1 };
        } else if (prev.m > 0) {
          return { m: prev.m - 1, s: 59 };
        } else {
          return { m: 14, s: 59 }; // reinicia
        }
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const pacoteHero = {
    nome: "TODOS OS CONTEÚDOS & CANAL VIP",
    quantidadeVideos: 200,
    qualidade: "FULL HD / 4K",
    tamanho: "50+ GB",
    preco: 150,
    precoOriginal: 350,
    descricao: "Acesso total e vitalício a todas as pastas, vídeos exclusivos e actualizações diárias.",
  };

  const linkWhatsApp = gerarLinkWhatsApp(pacoteHero);

  const formatarDigito = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      
      {/* ─── TÍTULO DE TOPO (ESTILO "Content • Exclusive packs for creators") ─── */}
      <div className="text-center my-4 sm:my-6">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Conteúdo Exclusivo
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Pacotes VIP e colecções completas seleccionadas
        </p>
      </div>

      {/* ─── FLASH SALE BOX (IDÊNTICO À IMAGEM DE REFERÊNCIA) ─── */}
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-[#1a0808] to-[#120505] p-4 sm:p-5 text-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-400 uppercase">
          FLASH SALE • LIMITED TIME OFFER
        </span>

        {/* Dígitos do Contador estilo "00 : 12 : 32" */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-3xl sm:text-5xl font-black text-white my-2 tracking-wider">
          <span className="text-red-500">00</span>
          <span className="text-red-500/60">:</span>
          <span className="text-red-500">{formatarDigito(tempo.m)}</span>
          <span className="text-red-500/60">:</span>
          <span className="text-red-500">{formatarDigito(tempo.s)}</span>
        </div>

        <p className="text-xs text-amber-400/90 font-bold flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>CORRA! Esta oferta especial encerra em {tempo.m} minutos e {tempo.s} segundos</span>
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        </p>
      </div>

      {/* ─── CARD PRINCIPAL VIP (ESTILO REFERÊNCIA COM IMAGEM E DADOS) ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-[#3b1d6e] bg-[#120a24] shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col">
        
        {/* Imagem / Cover superior do Hero */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-gradient-to-br from-[#1b0a36] via-[#2d1257] to-[#120524] flex items-center justify-center">
          <Image
            src="https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193573944-thumb.jpg"
            alt="VIP Channel"
            fill
            unoptimized
            className="object-cover scale-100 opacity-70"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Texto central sobreposto */}
          <div className="relative z-10 text-center px-4">
            <span className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              TODOS OS CONTEÚDOS & CANAL VIP
            </span>
          </div>

          {/* Badge DESTAQUE no canto superior esquerdo */}
          <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded shadow">
            DESTAQUE
          </div>
        </div>

        {/* Corpo do Hero */}
        <div className="p-5 sm:p-7 flex flex-col gap-3.5">
          {/* Título e Badge -49% */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">
              ALL CONTENT & VIP CHANNEL
            </h1>
            <span className="bg-[#382803] border border-amber-500/40 text-amber-400 font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded flex-shrink-0">
              -49%
            </span>
          </div>

          <p className="text-zinc-400 text-xs sm:text-sm">
            1.850+ clientes ativos • Acesso vitalício
          </p>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Acesso total a todas as pastas, colecções completas, vídeos em Full HD/4K e actualizações semanais automáticas.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {["PRO", "PREMIUM", "20000+ FICHEIROS", "6 TB", "FULL HD / 4K"].map((tag) => (
              <span
                key={tag}
                className="bg-[#1c1236] border border-purple-500/25 text-purple-300 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Preço */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-zinc-500 text-sm sm:text-base font-bold line-through">
              350 MT
            </span>
            <span className="text-2xl sm:text-4xl font-black text-[#facc15]">
              150 MT
            </span>
          </div>

          {/* ─── BOTÕES ROBUSTOS E EQUILIBRADOS COM ÍCONE WHATSAPP ─── */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 pt-2">
            {/* Botão PRÉVIA */}
            <button
              onClick={() => setMostrarPrevia(true)}
              className="w-full sm:w-auto h-12 sm:h-13 bg-[#1c1633] hover:bg-[#282048] text-zinc-200 text-xs sm:text-base font-bold px-4 sm:px-6 rounded-xl border border-purple-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
              <span>PRÉVIA</span>
            </button>

            {/* Botão COMPRAR AGORA COM ÍCONE DO WHATSAPP */}
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-12 sm:h-13 flex-1 sm:flex-initial bg-[#00a2ff] hover:bg-[#0091ea] text-white text-xs sm:text-base font-black px-4 sm:px-8 rounded-xl shadow-[0_4px_20px_rgba(0,162,255,0.35)] transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 active:scale-95 select-none"
            >
              {/* Ícone oficial do WhatsApp */}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="truncate">COMPRAR 150 MT</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Prévia do Banner */}
      {mostrarPrevia && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setMostrarPrevia(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#111116] rounded-2xl overflow-hidden border border-purple-600/40 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-xl">Prévia do Canal VIP</h3>
              <button
                onClick={() => setMostrarPrevia(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              O Pacote Supremo dá acesso a todos os mais de 200 vídeos da plataforma em alta resolução com atualizações garantidas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarPrevia(false)}
                className="flex-1 bg-zinc-800 text-zinc-300 font-bold h-12 rounded-xl text-sm"
              >
                Fechar
              </button>
              <a
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#00a8e8] text-white font-bold h-12 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Comprar 150 MT
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
