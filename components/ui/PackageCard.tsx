"use client";

import { useState, useRef, useEffect } from "react";
import { Play, X, Eye, Film, Lock, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { gerarLinkWhatsApp, type Pacote } from "@/lib/whatsapp";
import Image from "next/image";

interface PackageCardProps {
  pacote: Pacote;
  imagemUrl?: string | null;
  videoUrl?: string | null;
  badge?: string;
  badgeCor?: "vermelho" | "verde" | "roxo" | "amarelo";
  vendasHoje?: number;
  vagasRestantes?: number;
  destaque?: boolean;
}

export function PackageCard({
  pacote,
  imagemUrl,
  videoUrl,
  badge,
  badgeCor = "vermelho",
  vendasHoje = 30,
  vagasRestantes = 64,
  destaque = false,
}: PackageCardProps) {
  const [mostrarPrevia, setMostrarPrevia] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [fimPrevia, setFimPrevia] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const DURACAO_PREVIA = 10; // Exatamente 10 segundos de prévia
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const linkWhatsApp = gerarLinkWhatsApp(pacote);

  const desconto = pacote.precoOriginal
    ? Math.round(((pacote.precoOriginal - pacote.preco) / pacote.precoOriginal) * 100)
    : 0;

  const coresBadge: Record<string, string> = {
    vermelho: "bg-red-600 text-white",
    verde: "bg-emerald-500 text-white",
    roxo: "bg-purple-600 text-white",
    amarelo: "bg-amber-400 text-black",
  };

  useEffect(() => {
    if (mostrarPrevia) {
      setTempoAtual(0);
      setFimPrevia(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setTempoAtual(0);
      setFimPrevia(false);
    }
  }, [mostrarPrevia]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setTempoAtual(Math.min(t, DURACAO_PREVIA));
    if (t >= DURACAO_PREVIA) {
      videoRef.current.pause();
      setFimPrevia(true);
    }
  };

  const reiniciarPrevia = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setTempoAtual(0);
      setFimPrevia(false);
    }
  };

  return (
    <>
      {/* ─── CARD PRINCIPAL (ESTILO REFERÊNCIA VIP CONTENT) ─── */}
      <div
        className={`relative flex flex-col bg-[#101015] rounded-2xl overflow-hidden border transition-all duration-300 group
          ${destaque
            ? "border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]"
            : "border-zinc-800/80 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          }`}
      >
        {/* ─── ÁREA DE IMAGEM / VÍDEO (ASPECT 16/9 CINEMATOGRÁFICO) ─── */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
          {/* Se for card destaque especial tipo "PREMIUM CP" da referência */}
          {destaque ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a0b36] via-[#2d1154] to-[#14082b]">
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 tracking-wider">
                {pacote.nome}
              </span>
            </div>
          ) : imagemUrl ? (
            <Image
              src={imagemUrl}
              alt={pacote.nome}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
            />
          ) : videoUrl ? (
            <video
              src={`${videoUrl}#t=0.5`}
              preload="metadata"
              muted
              playsInline
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#151520]">
              <Film className="w-10 h-10 text-zinc-700" />
            </div>
          )}

          {/* Badge superior esquerdo (HOT, NOVO, etc.) */}
          {badge && (
            <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow ${coresBadge[badgeCor]}`}>
              {badge}
            </div>
          )}

          {/* Vagas restantes no canto inferior direito da imagem */}
          {vagasRestantes !== undefined && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded">
              {vagasRestantes} vagas
            </div>
          )}
        </div>

        {/* ─── CORPO DO CARD ─── */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
          {/* Linha 1: Título e Desconto */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-white font-black text-sm sm:text-base uppercase tracking-tight truncate">
              {pacote.nome}
            </h3>
            {desconto > 0 && (
              <span className="bg-[#2a2205] text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded flex-shrink-0">
                -{desconto}%
              </span>
            )}
          </div>

          {/* Linha 2: Quantidade de compras (social proof) */}
          <p className="text-zinc-400 text-xs font-medium">
            {vendasHoje} compras hoje
          </p>

          {/* Linha 3: Descrição curta */}
          {pacote.descricao && (
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-1">
              {pacote.descricao}
            </p>
          )}

          {/* Linha 4: Tags pills limpas, de alto contraste e sem o sinal de + */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="bg-[#1c182c] text-purple-200 border border-purple-500/40 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
              {pacote.quantidadeVideos} VÍDEOS
            </span>
            {pacote.tamanho && (
              <span className="bg-[#181822] text-zinc-100 border border-zinc-700/80 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {pacote.tamanho}
              </span>
            )}
            {pacote.qualidade && (
              <span className="bg-[#0f1f2e] text-cyan-200 border border-cyan-500/40 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {pacote.qualidade}
              </span>
            )}
          </div>

          {/* Linha 5: Preço */}
          <div className="flex items-baseline gap-2 mt-auto pt-2">
            {pacote.precoOriginal && (
              <span className="text-zinc-500 text-xs sm:text-sm font-semibold line-through">
                {pacote.precoOriginal} MT
              </span>
            )}
            <span className="text-white text-lg sm:text-xl font-black">
              {pacote.preco} MT
            </span>
          </div>

          {/* ─── LINHA 6: BOTÕES EQUILIBRADOS (50% PRÉVIA / 50% COMPRAR) ─── */}
          <div className="grid grid-cols-2 gap-2 pt-1.5 w-full">
            {/* Botão PRÉVIA com mesma largura e espaço generoso */}
            <button
              onClick={() => setMostrarPrevia(true)}
              className="w-full h-12 bg-[#1a1926] hover:bg-[#262438] text-zinc-200 text-xs sm:text-sm font-bold rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              aria-label="Ver prévia"
            >
              <Eye className="w-4 h-4 text-zinc-400" />
              <span>PRÉVIA</span>
            </button>

            {/* Botão COMPRAR com largura equilibrada e ÍCONE DO WHATSAPP */}
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-[#00a2ff] hover:bg-[#0091ea] text-white text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,162,255,0.3)] transition-all active:scale-95 select-none"
              aria-label={`Comprar pacote por ${pacote.preco} MT no WhatsApp`}
            >
              {/* Ícone oficial do WhatsApp */}
              <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="truncate">COMPRAR {pacote.preco} MT</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── MODAL DE PRÉVIA COM VÍDEO ─── */}
      {mostrarPrevia && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setMostrarPrevia(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#111116] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setMostrarPrevia(false)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black text-white rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Player de Prévia com Trava de 10 Segundos */}
            <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  controls={false}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setFimPrevia(true)}
                />
              ) : imagemUrl ? (
                <Image
                  src={imagemUrl}
                  alt={pacote.nome}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-16 h-16 text-zinc-600" />
                </div>
              )}

              {/* Indicador de Prévia de 10s e Controle de Áudio no topo */}
              {!fimPrevia && videoUrl && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <div className="bg-black/80 backdrop-blur-md border border-red-500/30 text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>00:{String(Math.floor(tempoAtual)).padStart(2, "0")} / 00:10</span>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700 text-white hover:text-purple-300 transition-colors"
                    title={isMuted ? "Ativar Áudio" : "Mutar Áudio"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              )}

              {/* Barra de Progresso dos 10 Segundos */}
              {!fimPrevia && videoUrl && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80 z-10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-[#00a2ff] transition-all duration-200"
                    style={{ width: `${(tempoAtual / DURACAO_PREVIA) * 100}%` }}
                  />
                </div>
              )}

              {/* Overlay de Bloqueio aos 10 Segundos */}
              {fimPrevia && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center animate-fade-in z-20">
                  <div className="w-11 h-11 rounded-2xl bg-purple-600/25 border border-purple-500/50 flex items-center justify-center text-purple-400 mb-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-amber-400 text-[11px] font-black uppercase tracking-widest">
                    🔒 Fim da Prévia de 10 Segundos
                  </span>
                  <h4 className="text-white font-black text-base sm:text-lg mt-1">
                    Liberar os {pacote.quantidadeVideos} vídeos completos?
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1 max-w-xs">
                    Compre o pacote completo em alta qualidade por apenas <strong className="text-white">{pacote.preco} MT</strong>.
                  </p>

                  <div className="flex items-center gap-2.5 mt-3.5 w-full max-w-xs">
                    <button
                      onClick={reiniciarPrevia}
                      className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Rever
                    </button>
                    <a
                      href={linkWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#00a2ff] hover:bg-[#0091ea] text-white text-xs font-black shadow-[0_2px_12px_rgba(0,162,255,0.4)] flex items-center justify-center gap-1.5 active:scale-95 transition-all truncate"
                    >
                      Comprar Pacote Completo
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-xs">Pacote Completo</p>
                  <div className="flex items-baseline gap-2">
                    {pacote.precoOriginal && (
                      <span className="text-zinc-500 text-sm line-through">{pacote.precoOriginal} MT</span>
                    )}
                    <span className="text-white text-2xl font-black">{pacote.preco} MT</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-[#1c1236] text-purple-200 border border-purple-500/40 text-xs font-black px-3 py-1.5 rounded-lg">
                    {pacote.quantidadeVideos} VÍDEOS
                  </span>
                </div>
              </div>

              {/* Botão comprar com WhatsApp dentro do modal */}
              <a
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-13 flex items-center justify-center gap-2.5 bg-[#00a2ff] hover:bg-[#0091ea] text-white font-black py-4 rounded-xl shadow-[0_4px_20px_rgba(0,162,255,0.35)] transition-all text-sm active:scale-95"
              >
                <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>COMPRAR PACOTE NO WHATSAPP — {pacote.preco} MT</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
