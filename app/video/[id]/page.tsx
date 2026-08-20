"use client";

import { notFound } from "next/navigation";
import { useState, use, useEffect } from "react";
import { VideoActions } from "./VideoActions";
import { VideoCard } from "@/components/ui/VideoCard";
import { PreviewPlayer } from "@/components/ui/PreviewPlayer";
import { Eye, ShieldCheck, Film, ThumbsUp, MessageSquare } from "lucide-react";

import { createClient } from "@/services/supabase/client";

export default function VideoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data: videoData } = await supabase
          .from("videos")
          .select("*, category:categories(name)")
          .eq("id", resolvedParams.id)
          .single();

        if (videoData) {
          setVideo(videoData);
          
          let query = supabase.from("videos").select("*, category:categories(name)").neq("id", videoData.id).eq("status", "published").limit(8);
          if (videoData.category_id) {
            query = query.eq("category_id", videoData.category_id);
          }
          
          const { data: relatedData } = await query;
          if (relatedData) setRelatedVideos(relatedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="w-full pb-16 animate-pulse">
        <div className="w-full bg-zinc-900 border-b border-zinc-800 aspect-video md:h-[60vh]" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8 md:mt-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
              <div className="h-10 w-3/4 bg-zinc-800 rounded mb-4" />
              <div className="h-6 w-1/2 bg-zinc-800 rounded mb-8" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-800 rounded" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="w-full lg:w-[350px] flex-shrink-0 pt-4 md:pt-14">
               <div className="h-48 w-full bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!video) {
    notFound();
  }

  return (
    <div className="w-full pb-16">
      {/* Container Principal do Player */}
      <div className="w-full bg-[#030303] border-b border-zinc-900 pt-0 md:pt-6">
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          <PreviewPlayer 
            src={video.video_url}
            poster={video.thumbnail_url || undefined}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8 md:mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Informações Principais */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium">
                <Film className="w-4 h-4" />
                {`${Math.floor((video.duration || 15) / 60)}:${((video.duration || 15) % 60).toString().padStart(2, '0')}`}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tighter">
              {video.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-base text-zinc-300 mb-8 font-bold">
              <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default" title="Visualizações">
                <Eye className="w-5 h-5 text-zinc-500" />
                0
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default" title="Curtidas">
                <ThumbsUp className="w-5 h-5 text-zinc-500" />
                0
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-pointer" title="Comentários">
                <MessageSquare className="w-5 h-5 text-zinc-500" />
                0
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                {video.description || "Nenhuma legenda fornecida para este vídeo."}
              </p>
            </div>
          </div>

          {/* Painel de Ações (Apenas Botão) */}
          <div className="w-full lg:w-[350px] flex-shrink-0 pt-4 md:pt-14">
            <div className="sticky top-24">
              <VideoActions 
                videoId={video.id} 
                title={video.title} 
                price={video.price} 
                rentalPrice={video.rental_price} 
              />
            </div>
          </div>
        </div>

        {/* Recomendados */}
        <div className="mt-20 pt-10 border-t border-zinc-900">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Você também vai gostar</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedVideos.map((rv) => (
              <VideoCard 
                key={rv.id}
                id={rv.id}
                title={rv.title}
                description={rv.description}
                category={rv.category?.name || "Sem Categoria"}
                duration={`${Math.floor((rv.duration || 15) / 60)}:${((rv.duration || 15) % 60).toString().padStart(2, '0')}`}
                price={rv.price}
                rentalPrice={rv.rental_price}
                imageUrl={rv.thumbnail_url}
                videoUrl={rv.video_url}
                views="0"
              />
            ))}
            {relatedVideos.length === 0 && (
              <p className="text-zinc-500 text-sm col-span-full">Não há vídeos semelhantes no momento.</p>
            )}
          </div>

          {/* Paginação */}
          <div className="pt-10 pb-6 flex justify-center w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 max-w-full">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-8 sm:h-10 px-2 sm:px-3 bg-zinc-900 border border-zinc-800 rounded text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ant.
              </button>
              
              {[1, 2, 3].map((page) => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded text-xs sm:text-sm font-bold transition-colors ${
                    page === currentPage 
                      ? "bg-red-600 text-white border border-red-600" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="flex items-center justify-center w-6 sm:w-8 h-8 sm:h-10 text-zinc-500 text-xs sm:text-sm">...</span>
              
              <button 
                onClick={() => setCurrentPage(42)}
                className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded text-xs sm:text-sm font-bold transition-colors ${
                    currentPage === 42 
                      ? "bg-red-600 text-white border border-red-600" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
              >
                42
              </button>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(42, prev + 1))}
                disabled={currentPage === 42}
                className="flex items-center justify-center h-8 sm:h-10 px-2 sm:px-3 bg-zinc-900 border border-zinc-800 rounded text-xs sm:text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próx.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
