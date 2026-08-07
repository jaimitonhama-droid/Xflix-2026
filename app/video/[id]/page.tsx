"use client";

import { notFound } from "next/navigation";
import { useState, use } from "react";
import { VideoActions } from "./VideoActions";
import { VideoCard } from "@/components/ui/VideoCard";
import { PreviewPlayer } from "@/components/ui/PreviewPlayer";
import { PaywallModal } from "@/components/ui/PaywallModal";
import { Eye, ShieldCheck, Film, ThumbsUp, MessageSquare } from "lucide-react";

// Mock para simular banco. Substituir por chamada real no Supabase depois.
const MOCK_VIDEOS = [
  { id: "1", title: "Curso Completo de Design", category: "Design", duration: "02:15:00", likes: 1200, comments: 342, views: "15K", description: "Aprenda do zero ao avançado.", price: 500, rentalPrice: 100, preview_url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail_url: "https://images.unsplash.com/photo-1542051812871-757500d5a228?q=80&w=2000&auto=format&fit=crop" },
];

export default function VideoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Simulação de busca no banco
  const video = MOCK_VIDEOS.find(v => v.id === resolvedParams.id) || MOCK_VIDEOS[0];

  if (!video) {
    notFound();
  }

  return (
    <div className="w-full pb-16">
      {/* Container Principal do Player */}
      <div className="w-full bg-[#030303] border-b border-zinc-900 pt-0 md:pt-6">
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          <PreviewPlayer 
            src={video.preview_url}
            poster={video.thumbnail_url}
            limitSeconds={10}
            onLimitReached={() => setIsPaywallOpen(true)}
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
                {video.duration}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tighter">
              {video.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-base text-zinc-300 mb-8 font-bold">
              <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default" title="Visualizações">
                <Eye className="w-5 h-5 text-zinc-500" />
                {video.views}
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default" title="Curtidas">
                <ThumbsUp className="w-5 h-5 text-zinc-500" />
                {video.likes}
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-pointer" title="Comentários">
                <MessageSquare className="w-5 h-5 text-zinc-500" />
                {video.comments}
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <h3 className="text-white font-bold mb-2">Sinopse</h3>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                {video.description}
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
                rentalPrice={video.rentalPrice} 
              />
            </div>
          </div>
        </div>

        {/* Recomendados */}
        <div className="mt-20 pt-10 border-t border-zinc-900">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Você também vai gostar</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Mocking recomendados */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <VideoCard 
                key={i}
                id={i.toString()}
                title={`Vídeo Semelhante ${i}`}
                category={video.category}
                imageUrl="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
              />
            ))}
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

      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        videoId={video.id} 
        price={video.rentalPrice || video.price || 150}
      />
    </div>
  );
}
