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

      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
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
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8 font-medium">
              <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <ThumbsUp className="w-5 h-5" />
                {video.likes} Curtidas
              </div>
              <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <MessageSquare className="w-5 h-5" />
                {video.comments} Comentários
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {video.views} Visualizações
              </div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 mb-8">
              <h3 className="text-white font-bold mb-3">Sinopse</h3>
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
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x hide-scrollbar">
            {/* Mocking recomendados usando a lista que já existe na home */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="snap-start">
                <VideoCard 
                  id={i.toString()}
                  title={`Vídeo Semelhante ${i}`}
                  category={video.category}
                  imageUrl="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
                />
              </div>
            ))}
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
