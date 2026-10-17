"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, UploadCloud, X, Film, DollarSign, Image as ImageIcon, CheckCircle2, RefreshCw, Eye, Tag, Sparkles, Shield, Star, Zap } from "lucide-react";
import { createClient } from "@/services/supabase/client";

interface PackageItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceOriginal: number;
  quantityVideos: number;
  size: string;
  quality: string;
  badge: string;
  thumbnail_url: string;
  video_url: string;
  created_at: string;
}

export default function AdminVideosPage() {
  const supabase = createClient();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Formulário de Cadastro do Pacote
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Exclusivos VIP");
  const [price, setPrice] = useState("30");
  const [priceOriginal, setPriceOriginal] = useState("60");
  const [quantityVideos, setQuantityVideos] = useState("50");
  const [size, setSize] = useState("15 GB");
  const [quality, setQuality] = useState("FULL HD");
  const [badge, setBadge] = useState("HOT");

  // Ficheiros Selecionados
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  
  // Controle de arrasto e captura de frame do vídeo
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentSeekTime, setCurrentSeekTime] = useState<number>(0);
  const [frameCapturedSuccess, setFrameCapturedSuccess] = useState<boolean>(false);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  // Cálculo dinâmico de desconto
  const precoNum = parseFloat(price) || 0;
  const precoOriginalNum = parseFloat(priceOriginal) || 0;
  const percentualDesconto = precoOriginalNum > precoNum
    ? Math.round(((precoOriginalNum - precoNum) / precoOriginalNum) * 100)
    : 0;

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*, category:categories(name)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setPackages([]);
      } else {
        const mapped: PackageItem[] = data.map((v: any) => {
          let parsedMeta = { text: v.description || "", size: "15 GB", quality: "FULL HD", badge: "HOT" };
          try {
            if (v.description && v.description.startsWith("{")) {
              parsedMeta = { ...parsedMeta, ...JSON.parse(v.description) };
            }
          } catch {
            parsedMeta.text = v.description || "";
          }

          return {
            id: v.id,
            title: v.title,
            description: parsedMeta.text,
            category: v.category?.name || "Sem Categoria",
            price: v.price || 30,
            priceOriginal: v.rental_price || (v.price ? v.price * 2 : 60),
            quantityVideos: v.duration || 50,
            size: parsedMeta.size || "15 GB",
            quality: parsedMeta.quality || "FULL HD",
            badge: parsedMeta.badge || "HOT",
            thumbnail_url: v.thumbnail_url || "https://images.unsplash.com/photo-1542051812871-757500d5a228?q=80&w=800&auto=format&fit=crop",
            video_url: v.video_url || "",
            created_at: new Date(v.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
          };
        });
        setPackages(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Formatar tempo em mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Selecionar Vídeo de Prévia
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setThumbnailFile(null);
      setThumbnailPreviewUrl(null);
      setVideoDuration(0);
      setCurrentSeekTime(0);
      setFrameCapturedSuccess(false);
    }
  };

  // Arrastar linha do tempo do vídeo
  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(newTime, videoDuration || 100));
    setCurrentSeekTime(clamped);
    if (captureVideoRef.current) {
      captureVideoRef.current.currentTime = clamped;
    }
  };

  // Capturar frame para a capa
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
            setFrameCapturedSuccess(true);
            setTimeout(() => setFrameCapturedSuccess(false), 2000);
          }
        }, "image/jpeg", 0.95);
      }
    }
  };

  // Upload manual de capa
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submeter Publicação do Pacote
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Por favor, preencha o nome do pacote.");
      return;
    }
    if (!videoFile) {
      alert("É obrigatório selecionar o ficheiro de vídeo da prévia.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 65) return prev + 2;
        if (prev < 85) return prev + 1;
        return prev;
      });
    }, 1000);

    try {
      // 1. Upload do Vídeo de Prévia
      const videoExt = videoFile.name.split('.').pop() || 'mp4';
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
           .from('videos')
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
        .maybeSingle();

      // 4. Montar metadata da descrição (para tamanho, qualidade e badge)
      const metaDescription = JSON.stringify({
        text: description,
        size: size || "15 GB",
        quality: quality || "FULL HD",
        badge: badge || "HOT",
      });

      // 5. Gravar na Base de Dados (Tabela Videos com campos de pacote)
      setUploadProgress(95);
      const { error: dbError } = await supabase
        .from("videos")
        .insert({
          title,
          description: metaDescription,
          price: precoNum,
          rental_price: precoOriginalNum,
          status: "published",
          thumbnail_url: finalThumbnailUrl,
          video_url: videoUrl,
          category_id: catData?.id || null,
          duration: parseInt(quantityVideos) || 50
        });

      if (dbError) throw new Error("Erro ao gravar dados na BD: " + dbError.message);

      setUploadProgress(100);
      alert("Pacote publicado com sucesso! Já está disponível na loja.");
      
      fetchPackages();
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
    setPrice("30");
    setPriceOriginal("60");
    setQuantityVideos("50");
    setSize("15 GB");
    setQuality("FULL HD");
    setBadge("HOT");
    setVideoFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setThumbnailFile(null);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl(null);
    setVideoDuration(0);
    setCurrentSeekTime(0);
    setFrameCapturedSuccess(false);
    setUploadProgress(0);
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este pacote da loja permanentemente?")) {
      try {
        const { error } = await supabase.from('videos').delete().eq('id', id);
        if (error) throw error;
        setPackages((prev) => prev.filter((v) => v.id !== id));
      } catch (err: any) {
        alert("Erro ao eliminar o pacote: " + err.message);
      }
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* ─── TOPO: TÍTULO E BOTÃO DE CRIAR PACOTE ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Film className="w-6 h-6 text-purple-400" />
            <span>Gerenciar Pacotes & Coleções VIP</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Publique coleções com preços, prévias e contagem de vídeos para venda no WhatsApp
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00a2ff] hover:bg-[#0091ea] text-white font-black px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,162,255,0.3)] transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Novo Pacote</span>
        </button>
      </div>

      {/* ─── BARRA DE PESQUISA & FILTRO ─── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121118] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 transition-all"
          />
        </div>
        <span className="text-xs text-zinc-400 font-bold self-start sm:self-center">
          {filteredPackages.length} pacotes activos
        </span>
      </div>

      {/* ─── GRELHA DE PACOTES PUBLICADOS ─── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#101015] rounded-2xl border border-zinc-800 p-8">
          <Film className="w-12 h-12 text-zinc-600 mb-3" />
          <h3 className="text-white font-bold text-base">Nenhum pacote publicado</h3>
          <p className="text-zinc-500 text-xs mt-1 mb-4">Clique no botão abaixo para adicionar a primeira coleção à loja.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            Adicionar Pacote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#101015] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col group"
            >
              {/* Thumbnail 16:9 */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={pkg.thumbnail_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow">
                  {pkg.badge}
                </div>

                {/* Contagem de vídeos */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-zinc-300 font-bold text-[10px] px-2 py-0.5 rounded">
                  {pkg.quantityVideos} vídeos
                </div>
              </div>

              {/* Corpo */}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-sm uppercase truncate">
                    {pkg.title}
                  </h3>
                  {pkg.priceOriginal > pkg.price && (
                    <span className="bg-[#2a2205] text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{Math.round(((pkg.priceOriginal - pkg.price) / pkg.priceOriginal) * 100)}%
                    </span>
                  )}
                </div>

                {pkg.description && (
                  <p className="text-zinc-400 text-xs line-clamp-1">
                    {pkg.description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="bg-[#171622] text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800">
                    {pkg.quantityVideos}+ VÍDEOS
                  </span>
                  <span className="bg-[#171622] text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800">
                    {pkg.size}
                  </span>
                  <span className="bg-[#171622] text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800">
                    {pkg.quality}
                  </span>
                </div>

                {/* Preço e Ações */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/80">
                  <div className="flex items-baseline gap-1.5">
                    {pkg.priceOriginal > 0 && (
                      <span className="text-zinc-500 text-xs line-through font-semibold">
                        {pkg.priceOriginal} MT
                      </span>
                    )}
                    <span className="text-white text-base font-black">
                      {pkg.price} MT
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir Pacote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL DE PUBLICAR NOVO PACOTE / COLEÇÃO VIP ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111116] border border-zinc-800 w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800/80 bg-[#14141c] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">Publicar Pacote VIP</h3>
                  <p className="text-xs text-zinc-400">Preencha os dados e anexe o teaser para WhatsApp</p>
                </div>
              </div>
              
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 active:scale-95 transition-all flex-shrink-0"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Rolável do Formulário */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
              <form id="publish-package-form" onSubmit={handleSavePackage} className="space-y-4">
                
                {/* 1. Nome do Pacote & Categoria */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Nome do Pacote / Coleção *</label>
                    <input 
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Coleção Premium VIP"
                      className="w-full h-12 bg-[#161520] border border-zinc-700/80 text-white text-base rounded-xl px-4 outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-12 bg-[#161520] border border-zinc-700/80 text-white text-base rounded-xl px-3 outline-none focus:border-purple-500 transition-all"
                    >
                      <option value="Exclusivos VIP">Exclusivos VIP</option>
                      <option value="Novos Conteúdos">Novos Conteúdos</option>
                      <option value="Teens VIP">Teens VIP</option>
                      <option value="Lançamentos">Lançamentos</option>
                      <option value="Populares">Populares</option>
                    </select>
                  </div>
                </div>

                {/* 2. PREÇOS: Preço Atual & Preço Riscado (com cálculo de desconto) */}
                <div className="bg-[#161522] p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <DollarSign className="w-4 h-4" /> Preço Atual (Venda) *
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="30"
                          className="w-full h-12 bg-[#111118] border border-zinc-700 text-emerald-400 font-black text-lg rounded-xl px-4 pr-12 outline-none focus:border-emerald-500 shadow-inner"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-500/70">MT</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <span>Preço Riscado (Antes)</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={priceOriginal}
                          onChange={(e) => setPriceOriginal(e.target.value)}
                          placeholder="60"
                          className="w-full h-12 bg-[#111118] border border-zinc-700 text-zinc-300 font-bold text-base rounded-xl px-4 pr-12 outline-none focus:border-purple-500 shadow-inner"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">MT</span>
                      </div>
                    </div>
                  </div>

                  {/* Indicador de Desconto */}
                  {percentualDesconto > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>🏷️ Desconto exibido: -{percentualDesconto}% OFF</span>
                      <span className="text-emerald-400">Economia: {precoOriginalNum - precoNum} MT</span>
                    </div>
                  )}
                </div>

                {/* 3. Quantidade de Vídeos, Tamanho, Qualidade e Badge */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Qtd. Vídeos *</label>
                    <input 
                      type="number"
                      required
                      value={quantityVideos}
                      onChange={(e) => setQuantityVideos(e.target.value)}
                      placeholder="54"
                      className="w-full h-12 bg-[#161520] border border-zinc-700/80 text-white font-bold text-base rounded-xl px-3.5 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Tamanho</label>
                    <input 
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="Ex: 22 GB"
                      className="w-full h-12 bg-[#161520] border border-zinc-700/80 text-white font-bold text-base rounded-xl px-3.5 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Qualidade</label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full h-12 bg-[#161520] border border-zinc-700/80 text-white font-bold text-base rounded-xl px-3 outline-none focus:border-purple-500"
                    >
                      <option value="FULL HD">FULL HD</option>
                      <option value="4K">4K</option>
                      <option value="HD">HD</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Selo / Badge</label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full h-12 bg-[#161520] border border-zinc-700/80 text-white font-bold text-base rounded-xl px-3 outline-none focus:border-purple-500"
                    >
                      <option value="HOT">HOT 🔥</option>
                      <option value="NOVO">NOVO ⭐</option>
                      <option value="EXCLUSIVO">EXCLUSIVO 💎</option>
                      <option value="PREMIUM">PREMIUM 👑</option>
                      <option value="MAIS VENDIDO">MAIS VENDIDO 🚀</option>
                    </select>
                  </div>
                </div>

                {/* 4. Descrição */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Descrição do Pacote</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Os melhores conteúdos selecionados com qualidade máxima."
                    className="w-full bg-[#161520] border border-zinc-700/80 text-white text-base rounded-xl p-3.5 outline-none focus:border-purple-500 placeholder:text-zinc-600 resize-none min-h-[80px]"
                  />
                </div>

                {/* 5. Upload do Vídeo de Prévia (Teaser MP4) */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Film className="w-4 h-4 text-purple-400" /> Vídeo de Prévia (MP4 Teaser) *
                  </label>
                  
                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] active:scale-[0.99]"
                  >
                    {videoFile ? (
                      <div className="space-y-1.5 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="text-sm text-white font-bold truncate max-w-[280px]">{videoFile.name}</p>
                        <p className="text-xs text-emerald-400/80 font-semibold">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Toque para trocar</p>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-zinc-200 font-bold">Toque para selecionar vídeo da prévia</span>
                        <span className="text-xs text-zinc-500">Formato .mp4 ou .mov</span>
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

                {/* 6. Extrator de Capa / Upload de Capa */}
                {videoPreviewUrl && (
                  <div className="space-y-4 bg-[#151520] p-4 rounded-2xl border border-zinc-800 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                        <ImageIcon className="w-4 h-4 text-purple-400" /> Escolha a Capa no Vídeo
                      </label>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                        {formatTime(currentSeekTime)} / {formatTime(videoDuration)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Player de captura com slider de arrasto */}
                      <div className="space-y-3 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800">
                        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-700">
                          <video 
                            ref={captureVideoRef}
                            src={videoPreviewUrl} 
                            preload="auto"
                            playsInline
                            className="w-full h-full object-contain"
                            onLoadedMetadata={(e) => {
                              const dur = e.currentTarget.duration || 0;
                              setVideoDuration(dur);
                              const initialTime = Math.min(1, dur > 1 ? 1 : 0);
                              e.currentTarget.currentTime = initialTime;
                              setCurrentSeekTime(initialTime);
                            }}
                            onSeeked={() => {
                              captureFrame();
                            }}
                          />
                        </div>

                        {/* Slider / Linha do Tempo interativa para arrastar */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                            <span>Arraste para o momento desejado:</span>
                            <span className="text-cyan-400 font-mono font-black">{formatTime(currentSeekTime)}</span>
                          </div>
                          
                          <input 
                            type="range"
                            min="0"
                            max={videoDuration || 10}
                            step="0.05"
                            value={currentSeekTime}
                            onChange={(e) => handleSeek(parseFloat(e.target.value))}
                            className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00a2ff] focus:outline-none"
                          />

                          {/* Botões de ajuste fino (-1s, +1s, Início, Fim) */}
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSeek(0)}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors active:scale-95"
                            >
                              Início
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSeek(currentSeekTime - 1)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors active:scale-95"
                            >
                              -1s
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSeek(currentSeekTime + 1)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors active:scale-95"
                            >
                              +1s
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSeek(videoDuration / 2)}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors active:scale-95"
                            >
                              Meio
                            </button>
                          </div>
                        </div>

                        {/* Botão para capturar o frame selecionado */}
                        <button 
                          type="button"
                          onClick={captureFrame}
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-[#00a2ff] hover:brightness-110 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-[0_4px_16px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 active:scale-95"
                        >
                          <ImageIcon className="w-4 h-4" /> 
                          <span>Capturar Este Frame Como Capa</span>
                        </button>
                      </div>

                      {/* Capa capturada / Preview final */}
                      <div className="space-y-3 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-200">Capa do Pacote Selecionada:</span>
                            {thumbnailPreviewUrl && (
                              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Pronta
                              </span>
                            )}
                          </div>
                          
                          <div className="w-full aspect-video bg-black rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                            {thumbnailPreviewUrl ? (
                              <img src={thumbnailPreviewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 text-zinc-500 p-4 text-center">
                                <ImageIcon className="w-8 h-8 opacity-40" />
                                <span className="text-xs font-semibold">Arraste a barra para escolher a foto de capa</span>
                              </div>
                            )}
                            <canvas ref={captureCanvasRef} className="hidden" />
                          </div>
                        </div>

                        {/* Opção alternativa: Enviar foto da galeria */}
                        <div className="pt-2 border-t border-zinc-800/80">
                          <button 
                            type="button"
                            onClick={() => thumbInputRef.current?.click()}
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl border border-zinc-700/80 flex items-center justify-center gap-2 active:scale-95 transition-all"
                          >
                            <UploadCloud className="w-4 h-4 text-purple-400" /> Ou Enviar Imagem do Celular / PC
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
                  </div>
                )}

                {/* Barra de Progresso */}
                {isUploading && (
                  <div className="space-y-2 bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-400" /> A publicar pacote...
                      </span>
                      <span className="text-purple-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-[#00a2ff] h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Rodapé do Modal - Sempre visível e fixo na parte inferior com botões confortáveis */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#14141c] flex-shrink-0 grid grid-cols-2 sm:flex sm:justify-end gap-3">
              <button 
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="h-12 px-4 rounded-xl font-bold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-sm flex items-center justify-center active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="publish-package-form"
                disabled={isUploading}
                className="h-12 px-6 rounded-xl font-black text-white bg-[#00a2ff] hover:bg-[#0091ea] text-sm flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(0,162,255,0.3)] disabled:opacity-50 active:scale-95"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Publicando...
                  </span>
                ) : (
                  "Publicar Pacote na Loja"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
