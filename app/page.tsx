"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Sparkles, Lock, Flame, ShieldCheck, Tag, RefreshCw } from "lucide-react";
import { VideoCard } from "@/components/ui/VideoCard";
import { PaywallModal } from "@/components/ui/PaywallModal";

const MOCK_VIDEOS = [
  { 
    id: 1, 
    title: "Cena Exclusiva VIP #01", 
    category: "Exclusivos VIP", 
    duration: "15:45", 
    price: 50, 
    rentalPrice: 20, 
    views: "18.5k",
    imageUrl: "https://images.unsplash.com/photo-1542051812871-757500d5a228?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    title: "Coleção Premium HD Vol. 2", 
    category: "Cenas Completas HD", 
    duration: "22:10", 
    price: 50, 
    rentalPrice: 20, 
    views: "24.1k",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    title: "Sessão Privada Sem Cortes", 
    category: "Exclusivos VIP", 
    duration: "18:30", 
    price: 50, 
    rentalPrice: 20, 
    views: "31.9k",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    title: "Especial Lançamento +18", 
    category: "Lançamentos", 
    duration: "12:00", 
    price: 50, 
    rentalPrice: 20, 
    views: "14.2k",
    imageUrl: "https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 5, 
    title: "Destaque Virais Vol. 4", 
    category: "Populares & Virais", 
    duration: "08:15", 
    price: 50, 
    rentalPrice: 20, 
    views: "42.0k",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 6, 
    title: "Bastidores Exclusivos VIP", 
    category: "Exclusivos VIP", 
    duration: "16:40", 
    price: 50, 
    rentalPrice: 20, 
    views: "19.8k",
    imageUrl: "https://images.unsplash.com/photo-1607262807149-adfa084dc090?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 7, 
    title: "Ensaio Especial HD Vol. 5", 
    category: "Cenas Completas HD", 
    duration: "25:00", 
    price: 50, 
    rentalPrice: 20, 
    views: "11.3k",
    imageUrl: "https://images.unsplash.com/photo-1512418490979-92798cec1380?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 8, 
    title: "Coleção VIP de Fim de Semana", 
    category: "Lançamentos", 
    duration: "30:15", 
    price: 50, 
    rentalPrice: 20, 
    views: "27.6k",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop" 
  },
];

export default function HomePage() {
  const [selectedLockedVideo, setSelectedLockedVideo] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = [
    "Todos",
    "Exclusivos VIP",
    "Cenas Completas HD",
    "Lançamentos",
    "Populares & Virais",
  ];

  const filteredVideos = activeCategory === "Todos" 
    ? MOCK_VIDEOS 
    : MOCK_VIDEOS.filter(v => v.category === activeCategory);

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
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 md:pb-0 scroll-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1); // Reset page on category change
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white text-zinc-950 shadow-md"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {cat === "Todos" && "🔥 "}
                {cat === "Exclusivos VIP" && "⭐ "}
                {cat === "Cenas Completas HD" && "🎬 "}
                {cat === "Lançamentos" && "🚀 "}
                {cat === "Populares & Virais" && "⚡ "}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grelha Principal de Cards de Vídeos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const isLocked = !hasPaid;

            return (
              <VideoCard 
                key={`video-${video.id}`}
                id={video.id}
                title={video.title}
                category={video.category}
                duration={video.duration}
                price={video.price}
                rentalPrice={video.rentalPrice}
                imageUrl={video.imageUrl}
                views={video.views}
                isLocked={isLocked}
                onLockedClick={() => setSelectedLockedVideo(video.id.toString())}
              />
            );
          })}
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
      
      {/* Modal de Paywall M-Pesa / e-Mola */}
      <PaywallModal 
        isOpen={!!selectedLockedVideo}
        onClose={() => setSelectedLockedVideo(null)}
        videoId={selectedLockedVideo || ""}
        onSuccess={() => setHasPaid(true)}
      />
    </div>
  );
}
