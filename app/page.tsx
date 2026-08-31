"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Sparkles, Lock, Flame, ShieldCheck, Tag, RefreshCw, Film } from "lucide-react";
import { VideoCard } from "@/components/ui/VideoCard";

import { createClient } from "@/services/supabase/client";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar Vídeos
        const { data: videoData } = await supabase
          .from("videos")
          .select("*, category:categories(name)")
          .eq("status", "published")
          .order("created_at", { ascending: false });
        
        if (videoData) {
          setVideos(videoData);
        }

        // Buscar Categorias Ativas do Banco de Dados
        const { data: catData } = await supabase
          .from("categories")
          .select("name")
          .eq("status", "active");

        if (catData) {
          const catNames = catData.map(c => c.name);
          setCategories(["Todos", ...catNames]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVideos = activeCategory === "Todos" 
    ? videos 
    : videos.filter(v => v.category?.name === activeCategory || v.category === activeCategory);

  // Lógica de Paginação
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / ITEMS_PER_PAGE));
  const paginatedVideos = filteredVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="w-full flex flex-col pb-16 pt-2 space-y-10 select-none">
      


      {/* 1. GRELHA E FILTROS DO CATÁLOGO DE VÍDEOS */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full space-y-6 mt-4">
        
        {/* Cabeçalho da Seção com Filtros de Categoria */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Vídeos Recentes
            </h2>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">18+</span>
          </div>
          
          {/* Pílulas de Categorias (Estilo Pílula Arredondada Premium) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 scroll-row -mx-6 px-6 md:mx-0 md:px-0">
            {categories.map((cat) => {
              // Ícones baseados no nome da categoria para manter um visual bonito
              let icon = "🎬 ";
              if (cat === "Todos") icon = "🔥 ";
              else if (cat.includes("VIP") || cat.includes("Exclusivo")) icon = "⭐ ";
              else if (cat.includes("Lançamento") || cat.includes("Novo")) icon = "🚀 ";
              else if (cat.includes("Popular") || cat.includes("Viral") || cat.includes("Visto")) icon = "⚡ ";

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1); // Reset page on category change
                  }}
                  className={`px-6 py-3 md:py-2.5 rounded-full text-[13px] md:text-xs font-bold whitespace-nowrap transition-all duration-300 border flex-shrink-0 ${
                    activeCategory === cat
                      ? "bg-white border-white text-zinc-950 shadow-[0_4px_15px_rgba(255,255,255,0.15)] scale-105"
                      : "bg-[#111113] border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {icon}{cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grelha Principal de Cards de Vídeos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 w-full animate-pulse">
                <div className="w-full aspect-video bg-zinc-900 rounded-xl" />
                <div className="flex flex-col gap-2 px-1">
                  <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-900 rounded-md w-1/2" />
                </div>
              </div>
            ))
          ) : (
            paginatedVideos.map((video) => {
              return (
                <VideoCard 
                  key={`video-${video.id}`}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  category={video.category?.name || "Sem Categoria"}
                  duration={`${Math.floor((video.duration || 15) / 60)}:${((video.duration || 15) % 60).toString().padStart(2, '0')}`}
                  price={video.price}
                  rentalPrice={video.rental_price}
                  imageUrl={video.thumbnail_url}
                  videoUrl={video.video_url}
                  views="0"
                />
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
              <Film className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white">Nenhum vídeo encontrado</h3>
            <p className="text-zinc-500 max-w-md">Você ainda não tem vídeos nesta categoria.</p>
          </div>
        )}

        {/* Paginação */}
        {!isLoading && totalPages > 1 && (
          <div className="pt-10 pb-6 flex justify-center w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 max-w-full">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-8 sm:h-10 px-2 sm:px-3 bg-zinc-900 border border-zinc-800 rounded text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ant.
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                return (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded text-xs sm:text-sm font-bold transition-colors ${
                      currentPage === page 
                        ? "bg-red-600 text-white border border-red-600" 
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-8 sm:h-10 px-2 sm:px-3 bg-zinc-900 border border-zinc-800 rounded text-xs sm:text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próx.
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
