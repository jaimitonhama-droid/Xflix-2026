"use client";

import { notFound } from "next/navigation";
import { useState, use, useEffect } from "react";
import { VideoActions } from "./VideoActions";
import { VideoCard } from "@/components/ui/VideoCard";
import { PreviewPlayer } from "@/components/ui/PreviewPlayer";
import { PaywallModal } from "@/components/ui/PaywallModal";
import { Eye, ShieldCheck, Film, ThumbsUp, MessageSquare } from "lucide-react";

import { createClient } from "@/services/supabase/client";

export default function VideoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Video
        const { data: videoData } = await supabase
          .from("videos")
          .select("*, category:categories(name)")
          .eq("id", resolvedParams.id)
          .single();

        if (videoData) {
          setVideo(videoData);
          
          // 1º Tentar buscar vídeos da mesma categoria
          let { data: relatedData } = await supabase
            .from("videos")
            .select("*, category:categories(name)")
            .neq("id", videoData.id)
            .eq("status", "published")
            .eq("category_id", videoData.category_id || "")
            .limit(4);
          
          // Se não tiver pelo menos 4 vídeos, preencher com outros vídeos aleatórios
          if (!relatedData || relatedData.length < 4) {
             const excludeIds = [videoData.id];
             if (relatedData) {
               relatedData.forEach(v => excludeIds.push(v.id));
             }
             
             const { data: moreData } = await supabase
              .from("videos")
              .select("*, category:categories(name)")
              .not("id", "in", `(${excludeIds.join(',')})`)
              .eq("status", "published")
              .limit(4 - (relatedData?.length || 0));
              
             if (moreData) {
                relatedData = [...(relatedData || []), ...moreData];
             }
          }

          if (relatedData) setRelatedVideos(relatedData);
        }

        // 2. Check Subscription
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_status")
            .eq("user_id", session.user.id)
            .single();
          
          if (profile?.subscription_status === "active") {
            setHasSubscription(true);
          } else {
            setShowPaywall(true);
          }
        } else {
          setShowPaywall(true); // User is not logged in, show paywall
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
      <div className="w-full bg-[#030303] border-b border-zinc-900 pt-0 md:pt-6 relative">
        <div className="max-w-7xl mx-auto px-0 md:px-4 relative">
          
          {hasSubscription ? (
            <PreviewPlayer 
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
            />
          ) : (
            <div className="w-full aspect-video bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden rounded-lg">
              {/* Blurred background thumbnail */}
              {video.thumbnail_url && (
                <img 
                  src={video.thumbnail_url} 
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30" 
                  alt="Background" 
                />
              )}
              
              <div className="z-10 flex flex-col items-center text-center p-6 space-y-4 max-w-md">
                <ShieldCheck className="w-16 h-16 text-red-500 mb-2" />
                <h2 className="text-2xl font-black text-white">Conteúdo Exclusivo VIP</h2>
                <p className="text-zinc-400 text-sm">Assine o nosso plano semanal para desbloquear este e todos os outros vídeos da plataforma ilimitadamente.</p>
                <button 
                  onClick={() => setShowPaywall(true)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Desbloquear Agora
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
      
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => {
          // Em um app real, onClose não desbloqueia. O desbloqueio acontece pelo webhook.
          // Mas para testes, podemos fechar o modal.
          setShowPaywall(false);
        }} 
        videoId={video.id} 
      />

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

            <h1 className="text-xl md:text-3xl font-black text-white leading-tight mb-4 tracking-tighter">
              {video.title}
            </h1>

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

          {/* A paginação foi removida porque 4 vídeos não precisam dela! */}
        </div>
      </div>
    </div>
  );
}
