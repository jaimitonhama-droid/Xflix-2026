"use client";

import { Download, Heart } from "lucide-react";
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";

type VideoActionsProps = {
  videoId: string;
  title: string;
  price?: number;
  rentalPrice?: number;
};

export function VideoActions({ videoId, title }: VideoActionsProps) {
  const { data: isFavorite, isLoading } = useIsFavorite(videoId);
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const isPending = isAdding || isRemoving;

  const handleDownload = () => {
    alert(`Iniciando o download de: ${title}`);
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(videoId);
    } else {
      addFavorite(videoId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={handleDownload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1"
      >
        <Download className="w-6 h-6" />
        <span>Baixar</span>
      </button>

      <button
        onClick={handleFavoriteClick}
        disabled={isLoading || isPending}
        className={`w-full font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 border-2 ${
          isFavorite
            ? "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            : "border-zinc-800 bg-transparent text-white hover:border-zinc-600 hover:bg-zinc-800/50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
        <span>{isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}</span>
      </button>
    </div>
  );
}
