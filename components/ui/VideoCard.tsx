import Link from "next/link";
import { Play, Clock, Eye, Lock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

type VideoCardProps = {
  id: string | number;
  title: string;
  category: string;
  price?: number;
  rentalPrice?: number;
  duration?: string;
  imageUrl: string;
  views?: string;
  isLocked?: boolean;
  onLockedClick?: () => void;
};

export function VideoCard({ 
  id, 
  title, 
  category, 
  price = 50, 
  rentalPrice = 20, 
  duration = "15:00", 
  imageUrl, 
  views = "12.4k",
  isLocked = true, 
  onLockedClick 
}: VideoCardProps) {
  
  const href = `/video/${id}`;

  return (
    <div className="group relative block bg-[#121215]/90 border border-zinc-800/80 hover:border-red-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl flex flex-col justify-between select-none">
      <Link href={href} className="block relative">
        {/* Container 16:9 para a Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
          
          {/* Overlay escuro em hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-colors duration-300" />
          
          {/* Botão de Play Centralizado */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600/90 hover:bg-red-600 p-3.5 rounded-full backdrop-blur-md transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(220,38,38,0.5)]">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Badges do Canto Superior */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none z-10">
            {isLocked ? (
              <span className="bg-red-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-md border border-red-500/30">
                <Lock className="w-3 h-3" />
                VIP • {rentalPrice > 0 ? `${rentalPrice} MT` : '20 MT'}
              </span>
            ) : (
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                GRÁTIS
              </span>
            )}
          </div>
          
          {/* Visualizações e Duração */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 text-[10px] text-zinc-300 font-semibold">
            <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
              <Eye className="w-3 h-3 text-red-500" /> {views}
            </span>
            <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" /> {duration}
            </span>
          </div>
        </div>

        {/* Informações do Vídeo */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
              {category}
            </span>
            <span className="text-zinc-400 font-medium">18+ VOD</span>
          </div>

          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
            {title}
          </h3>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Aluguer 24h:</span>
            <span className="text-emerald-400 font-black">{rentalPrice > 0 ? `${rentalPrice} MT` : '20 MT'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
