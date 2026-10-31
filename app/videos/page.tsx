"use client";

import { useState, useEffect, useMemo } from "react";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { PackageCard } from "@/components/ui/PackageCard";
import { createClient } from "@/services/supabase/client";
import { type Pacote } from "@/lib/whatsapp";

interface PacoteItem {
  id?: string;
  pacote: Pacote;
  imagemUrl?: string;
  videoUrl?: string;
  badge?: string;
  badgeCor?: "vermelho" | "verde" | "roxo" | "amarelo";
  vendasHoje?: number;
  vagasRestantes?: number;
  destaque?: boolean;
}

// ─── PACOTES BASE (FALLBACK INICIAL SE BANCO ESTIVER VAZIO OU OFFLINE) ─────────────
const PACOTES_BASE: PacoteItem[] = [
  {
    id: "base-1",
    pacote: {
      nome: "COLEÇÃO PREMIUM VIP",
      quantidadeVideos: 54,
      tamanho: "22 GB",
      qualidade: "FULL HD",
      preco: 30,
      precoOriginal: 60,
      descricao: "Os melhores conteúdos selecionados com qualidade máxima.",
    },
    badgeCor: "vermelho",
    vendasHoje: 54,
    vagasRestantes: 64,
    destaque: false,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193573944-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193495732-video.mp4",
  },
  {
    id: "base-2",
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
    id: "base-3",
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
    id: "base-4",
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
    destaque: true,
  },
  {
    id: "base-5",
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
    id: "base-6",
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
    id: "base-7",
    pacote: {
      nome: "PACK SELEÇÃO BELLE",
      quantidadeVideos: 22,
      tamanho: "8 GB",
      qualidade: "FULL HD",
      preco: 40,
      precoOriginal: 80,
      descricao: "Seleção especial com os momentos mais marcantes.",
    },
    badgeCor: "vermelho",
    vendasHoje: 22,
    vagasRestantes: 88,
    imagemUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788196302796-thumb.jpg",
    videoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788196177986-video.mp4",
  },
  {
    id: "base-8",
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

  // Carregar pacotes publicados do Supabase dinamicamente sem duplicações
  useEffect(() => {
    let isMounted = true;

    const fetchDbPackages = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("videos")
          .select("*, category:categories(name)")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (data && data.length > 0) {
          // 1. Mapear itens do banco
          const rawDbItems: PacoteItem[] = data.map((v: any) => {
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
              id: v.id,
              pacote: {
                nome: (v.title || "Pacote VIP").trim(),
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

          // 2. Desduplicação estrita dentro dos itens do banco (por ID, thumbnail e vídeo)
          const seenIds = new Set<string>();
          const seenThumbs = new Set<string>();
          const seenVideos = new Set<string>();
          const dbUnicos: PacoteItem[] = [];

          for (const item of rawDbItems) {
            if (item.id && seenIds.has(item.id)) continue;
            if (item.imagemUrl && seenThumbs.has(item.imagemUrl)) continue;
            if (item.videoUrl && seenVideos.has(item.videoUrl)) continue;

            if (item.id) seenIds.add(item.id);
            if (item.imagemUrl) seenThumbs.add(item.imagemUrl);
            if (item.videoUrl) seenVideos.add(item.videoUrl);

            dbUnicos.push(item);
          }

          // 3. Adicionar da lista base APENAS se o vídeo e thumbnail ainda não estiverem na vitrine
          const baseUnicos = PACOTES_BASE.filter((baseItem) => {
            const thumbJaExiste = baseItem.imagemUrl && seenThumbs.has(baseItem.imagemUrl);
            const videoJaExiste = baseItem.videoUrl && seenVideos.has(baseItem.videoUrl);
            const nomeJaExiste = dbUnicos.some(
              (d) => d.pacote.nome.toLowerCase() === baseItem.pacote.nome.toLowerCase()
            );
            return !thumbJaExiste && !videoJaExiste && !nomeJaExiste;
          });

          setPacotes([...dbUnicos, ...baseUnicos]);
        }
      } catch {
        // Fallback silencioso para pacotes base
      }
    };

    fetchDbPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtragem limpa e reativa por categoria
  const pacotesFiltrados = useMemo(() => {
    if (activeCategory === "Todos") return pacotes;

    if (activeCategory === "🔥 Populares") {
      return pacotes.filter(
        (p) =>
          p.badge === "POPULAR" ||
          p.badge === "MAIS VENDIDO" ||
          p.badge === "HOT" ||
          p.vendasHoje && p.vendasHoje > 30
      );
    }

    if (activeCategory === "⭐ Exclusivos") {
      return pacotes.filter(
        (p) => p.badge === "EXCLUSIVO" || p.badgeCor === "roxo" || p.destaque
      );
    }

    if (activeCategory === "💎 Premium") {
      return pacotes.filter(
        (p) =>
          p.badge === "PREMIUM" ||
          p.badgeCor === "amarelo" ||
          p.pacote.qualidade === "4K" ||
          p.pacote.preco >= 50
      );
    }

    return pacotes;
  }, [pacotes, activeCategory]);

  return (
    <div className="w-full min-h-screen bg-[#08080c] flex flex-col pb-24 select-none">
      {/* ─── 1. HERO BANNER ─── */}
      <HeroBanner />

      {/* ─── 2. ÁREA DE PACOTES (CONTAINER ESPAÇOSO 1520px) ─── */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Linha de cabeçalho: Filtros com scroll suave no mobile, contador de títulos à direita */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none -mx-2 px-2">
            {["Todos", "🔥 Populares", "⭐ Exclusivos", "💎 Premium"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-purple-600/30 border border-purple-500 text-purple-200"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contador de títulos únicos */}
          <span className="text-zinc-500 text-xs font-semibold whitespace-nowrap flex-shrink-0">
            {pacotesFiltrados.length} títulos
          </span>
        </div>

        {/* ─── GRELHA ESPAÇOSA DE CARDS (SEM DUPLICAÇÕES) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {pacotesFiltrados.map((item, idx) => (
            <PackageCard
              key={item.id || `${item.pacote.nome}-${item.videoUrl || item.imagemUrl || idx}`}
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
    </div>
  );
}
