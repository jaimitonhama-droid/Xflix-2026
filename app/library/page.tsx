import { redirect } from "next/navigation";
import { createClient } from "@/services/supabase/server";
import { VideoCard } from "@/components/ui/VideoCard";
import { Countdown } from "@/components/ui/Countdown";

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca a biblioteca do usuário fazendo join com a tabela de vídeos
  const { data: libraryItems, error } = await supabase
    .from("library")
    .select(`
      id,
      expires_at,
      purchase_type,
      video_id,
      videos (
        id,
        title,
        thumbnail_url,
        category:categories(name)
      )
    `)
    .eq("user_id", user.id)
    .order("expires_at", { ascending: true });

  if (error) {
    console.error("Erro ao carregar biblioteca:", error);
  }

  return (
    <div className="w-full flex flex-col pb-12 pt-6 min-h-screen bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Minha Biblioteca
          </h1>
        </div>

        {(!libraryItems || libraryItems.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/20 rounded-3xl border border-zinc-800/50">
            <h2 className="text-xl font-bold text-white mb-2">Sua biblioteca está vazia</h2>
            <p className="text-zinc-500 mb-6 max-w-md">Você ainda não comprou ou alugou nenhum vídeo. Explore nosso catálogo e encontre seus conteúdos favoritos.</p>
            <a href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
              Explorar Vídeos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {libraryItems.map((item: any) => {
              const video = item.videos;
              if (!video) return null;
              
              const isRent = item.purchase_type === "rent";

              return (
                <div key={item.id} className="w-full flex flex-col gap-3">
                  <VideoCard 
                    id={video.id}
                    title={video.title}
                    category={video.category?.name || "Premium"}
                    imageUrl={video.thumbnail_url}
                  />
                  {/* Se for aluguel e tiver data de expiração, mostramos o Countdown */}
                  {isRent && item.expires_at && (
                    <div className="mt-1">
                      <Countdown expiresAt={item.expires_at} />
                    </div>
                  )}
                  {!isRent && (
                    <div className="mt-1 flex items-center gap-2 text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 text-xs font-bold uppercase tracking-wider w-max">
                      <span>Acesso Vitalício</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
