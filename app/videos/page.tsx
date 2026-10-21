"use client";

import { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { PackageCard } from "@/components/ui/PackageCard";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { createClient } from "@/services/supabase/client";
import { type Pacote } from "@/lib/whatsapp";

interface PacoteItem {
  pacote: Pacote;
  imagemUrl?: string;
  videoUrl?: string;
  badge?: string;
  badgeCor?: "vermelho" | "verde" | "roxo" | "amarelo";
  vendasHoje?: number;
  vagasRestantes?: number;
  destaque?: boolean;
}

// ─── PACOTES PRINCIPAIS BASEADOS NO DESIGN DA REFERÊNCIA ─────────────
const PACOTES_BASE: PacoteItem[] = [
  {
    pacote: {
      nome: "COLEÇÃO PREMIUM VIP",
      quantidadeVideos: 54,
      tamanho: "22 GB",
      qualidade: "FULL HD",
      preco: 30,
      precoOriginal: 60,
      descricao: "Os melhores conteúdos selecionados com qualidade máxima.",
    },
    badge: "HOT",
    badgeCor: "vermelho",
    vendasHoje: 54,
    vagasRestantes: 64,
    destaque: false,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193573944-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193495732-video.mp4",
  },
  {
    pacote: {
      nome: "NOVOS CONTEÚDOS",
      quantidadeVideos: 29,
      tamanho: "20 GB",
      qualidade: "HD",
      preco: 45,
      precoOriginal: 90,
      descricao: "Os melhores vídeos recentemente adicionados à plataforma.",
    },
    badge: "NOVO",
    badgeCor: "verde",
    vendasHoje: 29,
    vagasRestantes: 76,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193834400-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193791366-video.mp4",
  },
  {
    pacote: {
      nome: "COLEÇÃO EXCLUSIVA",
      quantidadeVideos: 43,
      tamanho: "6 GB",
      qualidade: "FULL HD",
      preco: 99,
      precoOriginal: 200,
      descricao: "Acesso VIP a conteúdos exclusivos disponíveis apenas nesta coleção.",
    },
    badge: "EXCLUSIVO",
    badgeCor: "roxo",
    vendasHoje: 43,
    vagasRestantes: 346,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788194099980-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788194025070-video.mp4",
  },
  {
    pacote: {
      nome: "PREMIUM CP",
      quantidadeVideos: 17,
      tamanho: "9 GB",
      qualidade: "4K",
      preco: 50,
      precoOriginal: 100,
      descricao: "Conteúdo premium de máxima qualidade para os clientes mais exigentes.",
    },
    badge: "PREMIUM",
    badgeCor: "amarelo",
    vendasHoje: 17,
    vagasRestantes: 97,
    destaque: true, // Card roxo especial com borda neon idêntico à referência!
  },
  {
    pacote: {
      nome: "MEGA COLEÇÃO ALL CP",
      quantidadeVideos: 120,
      tamanho: "45 GB",
      qualidade: "FULL HD",
      preco: 75,
      precoOriginal: 180,
      descricao: "O maior pacote disponível com mais de 120 conteúdos completos.",
    },
    badge: "MAIS VENDIDO",
    badgeCor: "vermelho",
    vendasHoje: 89,
    vagasRestantes: 55,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788194314781-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788194264495-video.mp4",
  },
  {
    pacote: {
      nome: "PACOTE TEENS VIP",
      quantidadeVideos: 38,
      tamanho: "12 GB",
      qualidade: "HD",
      preco: 35,
      precoOriginal: 70,
      descricao: "Coleção especial de conteúdo jovem e moderno.",
    },
    badge: "POPULAR",
    badgeCor: "verde",
    vendasHoje: 38,
    vagasRestantes: 120,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788195998563-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788195968462-video.mp4",
  },
  {
    pacote: {
      nome: "PACK SELEÇÃO BELLE",
      quantidadeVideos: 22,
      tamanho: "8 GB",
      qualidade: "FULL HD",
      preco: 40,
      precoOriginal: 80,
      descricao: "Seleção especial com os momentos mais marcantes.",
    },
    badge: "HOT",
    badgeCor: "vermelho",
    vendasHoje: 22,
    vagasRestantes: 88,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788196302796-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788196177986-video.mp4",
  },
  {
    pacote: {
      nome: "BLACKMAIL PACK",
      quantidadeVideos: 31,
      tamanho: "14 GB",
      qualidade: "FULL HD",
      preco: 55,
      precoOriginal: 110,
      descricao: "Coleção intensa e exclusiva para os amantes do género.",
    },
    badge: "NOVO",
    badgeCor: "roxo",
    vendasHoje: 31,
    vagasRestantes: 50,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788350179290-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788350129863-video.mp4",
  },
];

export default function VideosPage() {
  const [pacotes, setPacotes] = useState<PacoteItem[]>(PACOTES_BASE);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  // Carregar pacotes publicados do Supabase dinamicamente
  useEffect(() => {
    const fetchDbPackages = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("videos")
          .select("*, category:categories(name)")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const dbItems: PacoteItem[] = data.map((v: any) => {
            let parsed = { text: v.description || "", size: "15 GB", quality: "FULL HD", badge: "HOT" };
            try {
              if (v.description && v.description.startsWith("{")) {
                parsed = { ...parsed, ...JSON.parse(v.description) };
              }
            } catch {
              parsed.text = v.description || "";
            }

            const badgeCor: "vermelho" | "verde" | "roxo" | "amarelo" =
              parsed.badge === "NOVO" ? "verde" :
              parsed.badge === "EXCLUSIVO" ? "roxo" :
              parsed.badge === "PREMIUM" ? "amarelo" : "vermelho";

            return {
              pacote: {
                nome: v.title,
                quantidadeVideos: v.duration || 50,
                tamanho: parsed.size || "15 GB",
                qualidade: parsed.quality || "FULL HD",
                preco: v.price || 30,
                precoOriginal: v.rental_price || (v.price ? v.price * 2 : 60),
                descricao: parsed.text || "Conteúdo exclusivo da coleção.",
              },
              badge: parsed.badge || "HOT",
              badgeCor,
              vendasHoje: 35,
              vagasRestantes: 64,
              imagemUrl: v.thumbnail_url,
              videoUrl: v.video_url,
            };
          });

          // Coloca os pacotes do banco de dados na frente
          setPacotes((prev) => {
            const nomesExistentes = new Set(dbItems.map((d) => d.pacote.nome.toLowerCase()));
            const unicos = prev.filter((p) => !nomesExistentes.has(p.pacote.nome.toLowerCase()));
            return [...dbItems, ...unicos];
          });
        }
      } catch {
        // Fallback silencioso para pacotes base
      }
    };

    fetchDbPackages();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#08080c] flex flex-col pb-24 select-none">
      {/* ─── 1. HERO BANNER (IDENTICO À REFERÊNCIA) ─── */}
      <HeroBanner />

      {/* ─── 2. ÁREA DE PACOTES (CONTAINER ESPAÇOSO 1520px) ─── */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Linha de cabeçalho: Filtros sutis à esquerda com scroll no mobile, contador de títulos à direita */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none -mx-2 px-2">
            {["Todos", "🔥 Populares", "⭐ Exclusivos", "💎 Premium"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === cat
                    ? "bg-purple-600/30 border border-purple-500 text-purple-200"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contador estilo "32 titles" da referência */}
          <span className="text-zinc-500 text-xs font-semibold whitespace-nowrap flex-shrink-0">
            {pacotes.length} titles
          </span>
        </div>

        {/* ─── GRELHA ESPAÇOSA DE CARDS (3 A 4 COLUNAS COM ESPAÇAMENTO RESPIRÁVEL) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {pacotes.map((item, idx) => (
            <PackageCard
              key={idx}
              pacote={item.pacote}
              imagemUrl={item.imagemUrl}
              videoUrl={item.videoUrl}
              badge={item.badge}
              badgeCor={item.badgeCor}
              vendasHoje={item.vendasHoje}
              vagasRestantes={item.vagasRestantes}
              destaque={item.destaque}
            />
          ))}
        </div>
      </div>

      {/* ─── 3. BOTÃO FLUTUANTE (IDÊNTICO AO "DM ME FOR MORE") ─── */}
      <WhatsAppButton />
    </div>
  );
}
