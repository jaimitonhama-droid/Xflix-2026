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
      
      {/* 1. HERO BANNER CINEMÁTICO DE DESTAQUE +18 */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-950 group">
          
          {/* Imagem de Fundo com Overlay Escuro Gradiente */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop" 
              alt="Destaque VIP da Semana" 
              className="w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
          </div>

          {/* Conteúdo do Hero Banner */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl space-y-5">
            
            {/* Badges do Banner */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-red-900/50 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" /> Lançamento VIP da Semana
              </span>
              <span className="bg-zinc-900/90 text-red-400 border border-red-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                20 MT / 50 MT
              </span>
              <span className="bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-semibold px-2 py-1 rounded-full">
                18+ VOD
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              Cena Exclusiva VIP <br />
              <span className="text-gradient">Edição Especial #05</span>
            </h1>

            {/* Subtítulo / Descrição */}
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-medium">
              Assista à prévia gratuita de 15 segundos ou desbloqueie todos os vídeos em alta definição instantaneamente via M-Pesa ou e-Mola.
            </p>

            {/* Pagamento Aceito em Destaque no Banner */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
                <img src="/images/mpesa.png" alt="M-Pesa" className="w-5 h-5 rounded object-cover" />
                <span className="text-xs font-bold text-white">M-Pesa</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
                <img src="/images/emola.png" alt="e-Mola" className="w-5 h-5 rounded object-cover" />
                <span className="text-xs font-bold text-white">e-Mola</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link 
                href="/video/1"
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)]"
              >
                <Play className="w-4 h-4 fill-white" /> Assistir Prévia Grátis
              </Link>
              
              <button 
                onClick={() => setSelectedLockedVideo("1")}
                className="flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition-all"
              >
                <Lock className="w-4 h-4 text-red-500" /> Desbloquear Passe VIP (20 MT)
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. GRELHA E FILTROS DO CATÁLOGO DE VÍDEOS */}
      <div className="max-w-7xl mx-auto px-4 w-full space-y-8">
        
        {/* Cabeçalho da Seção com Filtros de Categoria */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Conteúdos Recentes +18
            </h2>
            <p className="text-xs text-zinc-400 font-medium">Explore o nosso catálogo e desbloqueie vídeos com M-Pesa ou e-Mola.</p>
          </div>
          
          {/* Pílulas de Categorias +18 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scroll-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
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

        {/* Carregar Mais */}
        <div className="pt-8 flex justify-center">
          <button 
            onClick={() => alert("Mais vídeos do catálogo +18 carregados!")}
            className="flex items-center gap-2 bg-[#121215] hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold py-3.5 px-8 rounded-2xl transition-all border border-zinc-800 text-xs shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-red-500" /> Carregar Mais Vídeos
          </button>
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
