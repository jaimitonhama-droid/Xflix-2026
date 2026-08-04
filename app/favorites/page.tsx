"use client";

import { useState } from "react";
import { VideoCard } from "@/components/ui/VideoCard";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { data: favorites, isLoading, error } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Filter and search logic
  const filteredFavorites = favorites?.filter((fav) => {
    if (!fav.videos) return false;
    
    return fav.videos.title.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="w-full flex flex-col pb-12 pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 w-full">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-zinc-800 pb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Meus Favoritos
          </h1>
          
          <div className="flex flex-1 max-w-md items-center bg-zinc-900 rounded-lg border border-zinc-800 px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Pesquisar favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-500"
            />
          </div>
        </div>



        {/* Grade de Favoritos */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 font-medium">
            Erro ao carregar favoritos. Tente novamente mais tarde.
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 font-medium flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-xl text-white font-bold mb-2">Nenhum favorito encontrado</p>
            <p>
              {searchTerm 
                ? "Nenhum vídeo corresponde à sua pesquisa." 
                : "Você ainda não adicionou nenhum vídeo aos favoritos."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredFavorites.map((fav) => (
              <div key={`fav-${fav.id}`} className="w-full">
                <VideoCard 
                  id={fav.videos.id}
                  title={fav.videos.title}
                  category="Geral" // Can be mapped properly later
                  price={fav.videos.price}
                  rentalPrice={fav.videos.rental_price}
                  duration={fav.videos.duration?.toString()}
                  imageUrl={fav.videos.thumbnail_url || "https://images.unsplash.com/photo-1542051812871-757500d5a228?q=80&w=800&auto=format&fit=crop"} // Default placeholder
                  isLocked={false} // Would depend on logic in a real app
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
