"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, UploadCloud, X, Film, Clock, DollarSign, Image as ImageIcon, CheckCircle2, RefreshCw, Eye, Tag, AlertCircle } from "lucide-react";
import { createClient } from "@/services/supabase/client";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  price: number;
  rental_price: number;
  category: string;
  preview_seconds: number;
  thumbnail_url: string;
  video_url: string;
  created_at: string;
}

export default function AdminVideosPage() {
  const supabase = createClient();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Formulário de Cadastro
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Exclusivos VIP");
  const [price, setPrice] = useState("500");
  const [rentalPrice, setRentalPrice] = useState("150");
  const [previewSeconds, setPreviewSeconds] = useState("15");

  // Ficheiros Selecionados
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);


  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*, category:categories(name)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setVideos([]);
      } else {
        const mapped: VideoItem[] = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          description: v.description || "",
          price: v.price || 0,
          rental_price: v.rental_price || 0,
          category: v.category?.name || "Sem Categoria",
          preview_seconds: v.duration || 15,
          thumbnail_url: v.thumbnail_url || "https://images.unsplash.com/photo-1542051812871-757500d5a228?q=80&w=800&auto=format&fit=crop",
          video_url: v.video_url || "",
          created_at: new Date(v.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
        }));
        setVideos(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Selecionar Vídeo
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setThumbnailFile(null);
      setThumbnailPreviewUrl(null);
    }
  };

  const captureFrame = () => {
    const video = captureVideoRef.current;
    const canvas = captureCanvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
            setThumbnailFile(file);
            if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
            setThumbnailPreviewUrl(URL.createObjectURL(blob));
          }
        }, "image/jpeg", 0.85);
      }
    }
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submeter Upload do Vídeo
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Por favor, preencha o título do vídeo.");
      return;
    }
    if (!videoFile) {
      alert("É obrigatório selecionar o ficheiro de vídeo para publicar.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(5); // Inicia progresso

    // Simulate progress while uploading to prevent the "stuck" feeling
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 60) return prev + 2;
        if (prev < 85) return prev + 1;
        return prev;
      });
    }, 1000);

    try {
      // 1. Upload do Vídeo Principal
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${Date.now()}-video.${videoExt}`;
      const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile, { 
          cacheControl: '3600',
          contentType: videoFile.type
        });
      
      if (videoError) throw new Error("Erro no upload do vídeo: " + videoError.message);

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);
      
      clearInterval(progressInterval);
      setUploadProgress(85);

      // 2. Upload da Capa (se houver)
      let finalThumbnailUrl = null;
      if (thumbnailFile) {
         const thumbExt = thumbnailFile.name.split('.').pop() || 'jpg';
         const thumbFileName = `${Date.now()}-thumb.${thumbExt}`;
         const { error: thumbError } = await supabase.storage
           .from('videos') // Upload no mesmo bucket para evitar problemas
           .upload(thumbFileName, thumbnailFile, {
             cacheControl: '3600',
             contentType: thumbnailFile.type
           });
           
         if (thumbError) {
             console.warn("Erro no upload da capa:", thumbError);
         } else {
             const { data: { publicUrl: tUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(thumbFileName);
             finalThumbnailUrl = tUrl;
         }
      }

      setUploadProgress(90);

      // 3. Buscar ID da categoria selecionada
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", `%${category.split(' ')[0]}%`)
        .limit(1)
        .single();

      // 4. Gravar na Base de Dados (Tabela Videos)
      setUploadProgress(95);
      const { data: insertedVideo, error: dbError } = await supabase
        .from("videos")
        .insert({
          title,
          description,
          price: parseFloat(price) || 0,
          rental_price: parseFloat(rentalPrice) || 0,
          status: "published",
          thumbnail_url: finalThumbnailUrl,
          video_url: videoUrl,
          category_id: catData?.id || null,
          duration: parseInt(previewSeconds) || 15
        })
        .select()
        .single();

      if (dbError) throw new Error("Erro ao gravar dados na BD: " + dbError.message);

      setUploadProgress(100);
      alert("Vídeo publicado com sucesso na plataforma!");
      
      // Atualizar a lista localmente para refletir o novo vídeo
      fetchVideos();
      setIsModalOpen(false);
      resetForm();

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      alert("Ocorreu um erro: " + err.message);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("500");
    setRentalPrice("150");
    setVideoFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setThumbnailFile(null);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este vídeo do catálogo permanentemente?")) {
      try {
        const { error } = await supabase.from('videos').delete().eq('id', id);
        if (error) throw error;
        setVideos((prev) => prev.filter((v) => v.id !== id));
      } catch (err: any) {
        alert("Erro ao eliminar o vídeo: " + err.message);
      }
    }
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Gestão do Catálogo de Vídeos +18</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Adicione novos vídeos, defina capas, preços de aluguer/compra e a prévia gratuita.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button 
            onClick={fetchVideos}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#121215] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> <span className="hidden xs:inline">Atualizar</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Novo Vídeo
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* Input de Pesquisa */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar títulos no catálogo..."
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium w-full sm:w-auto">
          <Tag className="w-3.5 h-3.5 text-red-500" />
          <span>Categoria:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-1.5 outline-none focus:border-red-500 font-medium"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Exclusivos VIP">Exclusivos VIP</option>
            <option value="Cenas Completas HD">Cenas Completas HD</option>
            <option value="Lançamentos">Lançamentos</option>
            <option value="Populares & Virais">Populares & Virais</option>
          </select>
        </div>

      </div>

      {/* Grid de Vídeos do Catálogo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {filteredVideos.map((v) => (
          <div key={v.id} className="bg-[#121215]/90 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl group transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Thumbnail / Player fallback com Overlay */}
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                {v.thumbnail_url ? (
                  <img 
                    src={v.thumbnail_url} 
                    alt={v.title}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1542051812871-757500d5a228?q=80&w=800&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <video 
                    src={v.video_url}
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                  <span className="bg-zinc-950/80 backdrop-blur-md text-zinc-300 border border-zinc-800 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold line-clamp-1">
                    {v.category}
                  </span>
                </div>
              </div>

              {/* Detalhes do Vídeo */}
              <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                <h3 className="text-white font-bold text-xs sm:text-base group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
                  {v.title}
                </h3>
                <p className="text-zinc-400 text-[10px] sm:text-xs line-clamp-2 leading-tight">{v.description || "Sem descrição informada."}</p>
                
                {/* Preços (Compra e Aluguer) */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800/60">
                  <div className="bg-zinc-900/60 px-2 py-1.5 sm:p-2 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-[8px] sm:text-[10px] text-zinc-400 uppercase font-semibold">Compra</span>
                    <span className="text-emerald-400 font-extrabold text-[10px] sm:text-sm">MT {v.price}</span>
                  </div>
                  <div className="bg-zinc-900/60 px-2 py-1.5 sm:p-2 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-[8px] sm:text-[10px] text-zinc-400 uppercase font-semibold">Aluguer</span>
                    <span className="text-amber-400 font-extrabold text-[10px] sm:text-sm">MT {v.rental_price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações do Vídeo */}
            <div className="p-2 sm:p-4 bg-zinc-900/40 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="text-[9px] sm:text-[11px] text-zinc-500 font-medium hidden xs:block line-clamp-1">{v.created_at}</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button 
                  onClick={() => alert(`A editar vídeo: ${v.title}`)}
                  className="p-1.5 sm:p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg sm:rounded-xl border border-zinc-800 transition-colors"
                  title="Editar Vídeo"
                >
                  <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <button 
                  onClick={() => handleDeleteVideo(v.id)}
                  className="p-1.5 sm:p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-lg sm:rounded-xl border border-red-500/20 transition-all"
                  title="Eliminar Vídeo"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
      </div>

      {/* Modal de Publicar Novo Vídeo +18 (Redesenhado para Mobile) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121215] border border-zinc-800 w-full max-w-2xl rounded-2xl sm:rounded-3xl flex flex-col max-h-[95vh] sm:max-h-[90vh] shadow-2xl relative">
            
            {/* Header Fixo do Modal */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-black text-white tracking-tight">Publicar Novo Vídeo</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-400">Preencha os detalhes e carregue.</p>
                </div>
              </div>
              
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Conteúdo Rolável do Formulário */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <form id="publish-video-form" onSubmit={handleSaveVideo} className="space-y-5 sm:space-y-6">
                
                {/* Título & Categoria */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-300">Título do Vídeo *</label>
                    <input 
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Cena Exclusiva VIP Vol. 05"
                      className="w-full bg-zinc-900/80 border border-zinc-700/80 text-white text-xs sm:text-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-600 shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-300">Categoria *</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-700/80 text-white text-xs sm:text-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-red-500 appearance-none shadow-inner"
                      >
                        <option value="Exclusivos VIP">Exclusivos VIP</option>
                        <option value="Cenas Completas HD">Cenas Completas HD</option>
                        <option value="Lançamentos">Lançamentos</option>
                        <option value="Populares & Virais">Populares & Virais</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Descrição / Legenda */}
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs font-bold text-zinc-300">Legenda / Descrição</label>
                  <textarea 
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Escreva a legenda ou descrição do vídeo..."
                    className="w-full bg-zinc-900/80 border border-zinc-700/80 text-white text-xs sm:text-sm rounded-lg p-3 sm:p-4 focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-600 resize-none shadow-inner"
                  />
                </div>

                {/* Preços (Compra e Aluguer) - Ocultos na Versão V1 Gratuita */}
                <div className="hidden">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <input type="number" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} />
                </div>

                {/* Uploads (Ficheiro de Vídeo) */}
                <div className="space-y-3 sm:space-y-5 pt-2 border-t border-zinc-800/80">
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-red-500" /> Ficheiro de Vídeo (MP4) *
                    </label>
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 hover:border-red-500 bg-zinc-900/40 rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative group min-h-[90px] sm:min-h-[120px]"
                    >
                      {videoFile ? (
                        <div className="space-y-1 sm:space-y-2 text-center animate-fade-in">
                          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 mx-auto" />
                          <p className="text-xs sm:text-sm text-white font-bold truncate max-w-[200px] sm:max-w-[250px]">{videoFile.name}</p>
                          <p className="text-[10px] sm:text-xs text-emerald-400/80 font-medium">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 flex flex-col items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-1 group-hover:bg-red-500/20 transition-colors">
                            <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 group-hover:text-red-500 transition-colors" />
                          </div>
                          <span className="text-xs sm:text-sm text-zinc-300 font-bold">Toque para selecionar vídeo</span>
                          <span className="text-[10px] sm:text-xs text-zinc-500">Apenas formatos .mp4 ou .mov</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={videoInputRef} 
                        onChange={handleVideoChange} 
                        accept="video/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Extrator de Capa (Visível apenas se houver vídeo) */}
                  {videoPreviewUrl && (
                    <div className="space-y-2 sm:space-y-4 bg-zinc-900/60 p-3 sm:p-5 rounded-xl border border-zinc-800/80 animate-fade-in">
                      <div>
                        <label className="text-[11px] sm:text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-1">
                          <ImageIcon className="w-3.5 h-3.5 text-red-500" /> Capa do Vídeo (Thumbnail)
                        </label>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                        {/* Video Player para captura */}
                        <div className="flex-1 space-y-2">
                          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-700 shadow-sm relative">
                            <video 
                              ref={captureVideoRef}
                              src={videoPreviewUrl} 
                              controls
                              controlsList="nodownload"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={captureFrame}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] sm:text-xs font-bold py-2 sm:py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Capturar Cena
                          </button>
                        </div>

                        {/* Preview da Capa Selecionada */}
                        <div className="flex-1 space-y-2">
                          <div className="w-full aspect-video bg-zinc-950 rounded-lg border border-zinc-700 flex items-center justify-center overflow-hidden relative shadow-sm">
                             {thumbnailPreviewUrl ? (
                               <img src={thumbnailPreviewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover animate-fade-in" />
                             ) : (
                               <div className="flex flex-col items-center opacity-50">
                                 <ImageIcon className="w-6 h-6 text-zinc-600 mb-1" />
                                 <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Sem capa definida</span>
                               </div>
                             )}
                             <canvas ref={captureCanvasRef} className="hidden" />
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => thumbInputRef.current?.click()}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] sm:text-xs font-bold py-2 sm:py-3 rounded-lg transition-colors text-center border border-zinc-700 flex items-center justify-center gap-1.5"
                          >
                            <UploadCloud className="w-3.5 h-3.5" /> Enviar da Galeria
                          </button>
                          <input 
                            type="file"
                            ref={thumbInputRef}
                            onChange={handleThumbChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Barra de Progresso Real se estiver fazendo Upload */}
                {isUploading && (
                  <div className="space-y-2 bg-zinc-900/90 p-4 rounded-xl border border-zinc-700 animate-fade-in">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" /> Enviando vídeo...
                      </span>
                      <span className="text-red-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Rodapé Fixo (Botões) */}
            <div className="flex-shrink-0 p-3 sm:p-6 border-t border-zinc-800/80 bg-[#121215] flex flex-row items-center justify-end gap-3 sm:gap-3 rounded-b-2xl sm:rounded-b-3xl">
              <button 
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="publish-video-form"
                disabled={isUploading}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm transition-all shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50"
              >
                {isUploading ? "A processar..." : "Publicar Vídeo"}
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
