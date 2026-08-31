import { VideoCard } from "@/components/ui/VideoCard";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/services/supabase/server";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, page?: string }> }) {
  const params = await searchParams;
  const query = params.q || "";
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "1", 10);
  
  const ITEMS_PER_PAGE = 12;

  const supabase = await createClient();
  let queryBuilder = supabase.from('videos').select('*, category:categories(name)', { count: 'exact' }).eq('status', 'published');
  
  if (query) {
    // Busca simples por título e descrição
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // Ordenação
  switch(sort) {
    case 'newest': queryBuilder = queryBuilder.order('created_at', { ascending: false }); break;
    case 'price-asc': queryBuilder = queryBuilder.order('price', { ascending: true }); break;
    case 'price-desc': queryBuilder = queryBuilder.order('price', { ascending: false }); break;
    case 'views': queryBuilder = queryBuilder.order('views', { ascending: false }); break;
    case 'az': queryBuilder = queryBuilder.order('title', { ascending: true }); break;
  }

  const { data: videos, count } = await queryBuilder.range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);
  const currentVideos = videos || [];
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 md:py-12 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar - Filtros */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
            <SlidersHorizontal className="w-5 h-5 text-red-500" />
            Filtros
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Ordenar por</h4>
              <div className="flex flex-col space-y-2">
                <a href={`/search?q=${query}&sort=newest`} className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${sort === 'newest' ? 'bg-red-600/20 text-red-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>Mais Recentes</a>
                <a href={`/search?q=${query}&sort=views`} className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${sort === 'views' ? 'bg-red-600/20 text-red-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>Mais Vistos</a>
                <a href={`/search?q=${query}&sort=price-asc`} className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${sort === 'price-asc' ? 'bg-red-600/20 text-red-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>Menor Preço</a>
                <a href={`/search?q=${query}&sort=price-desc`} className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${sort === 'price-desc' ? 'bg-red-600/20 text-red-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>Maior Preço</a>
                <a href={`/search?q=${query}&sort=az`} className={`text-sm py-1.5 px-3 rounded-lg transition-colors ${sort === 'az' ? 'bg-red-600/20 text-red-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>Ordem Alfabética (A-Z)</a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Resultados */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {query ? (
              <>Resultados para <span className="text-red-500">&quot;{query}&quot;</span></>
            ) : "Explorar Todos os Vídeos"}
          </h1>
          <p className="text-zinc-500 text-sm">{totalItems} vídeos encontrados</p>
        </div>

        {currentVideos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {currentVideos.map(video => (
                <div key={video.id} className="w-full">
                  <VideoCard 
                    id={video.id}
                    title={video.title}
                    description={video.description}
                    category={video.category?.name || "Sem Categoria"}
                    duration={`${Math.floor((video.duration || 15) / 60)}:${((video.duration || 15) % 60).toString().padStart(2, '0')}`}
                    price={video.price}
                    rentalPrice={video.rental_price}
                    imageUrl={video.thumbnail_url}
                    videoUrl={video.video_url}
                    views="0"
                  />
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-zinc-900">
                <a 
                  href={`/search?q=${query}&sort=${sort}&page=${Math.max(1, page - 1)}`}
                  className={`p-2 rounded-lg border border-zinc-800 ${page === 1 ? 'text-zinc-600 pointer-events-none' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </a>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <a 
                    key={i}
                    href={`/search?q=${query}&sort=${sort}&page=${i + 1}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border ${page === i + 1 ? 'bg-white text-black font-bold border-white' : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors'}`}
                  >
                    {i + 1}
                  </a>
                ))}

                <a 
                  href={`/search?q=${query}&sort=${sort}&page=${Math.min(totalPages, page + 1)}`}
                  className={`p-2 rounded-lg border border-zinc-800 ${page === totalPages ? 'text-zinc-600 pointer-events-none' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-zinc-500 max-w-md">Não conseguimos encontrar resultados para sua busca. Tente palavras diferentes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
