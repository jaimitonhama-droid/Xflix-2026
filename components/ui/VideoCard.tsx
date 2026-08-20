import Link from "next/link";
import { Play, Eye, ThumbsUp, MessageSquare } from "lucide-react";

type VideoCardProps = {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  rentalPrice?: number;
  duration?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  views?: string;
  likes?: string;
  comments?: string;
  isLocked?: boolean;
  onLockedClick?: () => void;
};

export function VideoCard({ 
  id, 
  title, 
  description,
  imageUrl, 
  videoUrl,
  views = "0",
  likes = "0",
  comments = "0",
}: VideoCardProps) {
  
  const href = `/video/${id}`;

  return (
    <div className="group relative block bg-[#0a0a0c] md:bg-transparent hover:bg-zinc-900/40 rounded-2xl p-3 md:p-2 border border-white/5 md:border-transparent transition-all duration-300 select-none shadow-sm">
      <Link href={href} className="block relative flex flex-col gap-3">
        {/* Container 16:9 para a Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 rounded-xl shadow-lg border border-zinc-800/80 group-hover:border-red-500/40">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <video 
              src={videoUrl || ""}
              preload="auto"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
          )}
          


          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-20" />
          
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-30 pointer-events-none">
            <div className="bg-red-600/80 hover:bg-red-600 p-3.5 rounded-full backdrop-blur-sm transform group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Informações do Vídeo */}
        <div className="px-1 flex flex-col gap-1.5 mt-0.5">
          <h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-zinc-400 bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-white/5">
              <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> {views}
            </span>
            <span className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-zinc-400 bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-white/5">
              <ThumbsUp className="w-3 h-3 md:w-3.5 md:h-3.5" /> {likes}
            </span>
            <span className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-zinc-400 bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-white/5">
              <MessageSquare className="w-3 h-3 md:w-3.5 md:h-3.5" /> {comments}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

