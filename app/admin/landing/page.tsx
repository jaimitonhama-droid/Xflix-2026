"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Video as VideoIcon,
  Upload,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Save,
  RotateCcw,
  Play,
  User,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { createClient } from "@/services/supabase/client";

const DEFAULT_VIDEO = "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193495732-video.mp4";

export default function AdminLandingPage() {
  const supabase = createClient();

  // Vídeo e Botão
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO);
  const [buttonText, setButtonText] = useState("QUENTES");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Perfil da Modelo
  const [name, setName] = useState("carla reis");
  const [handle, setHandle] = useState("carla");
  const [bioShort, setBioShort] = useState("tudo que voce precisa ver");
  const [coverUrl, setCoverUrl] = useState("/images/model-cover.jpg");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState("/images/model-avatar.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Estados gerais
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/landing-page")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          const v = data.teaserVideoUrl || DEFAULT_VIDEO;
          setVideoUrl(v);
          setVideoPreview(v);
          if (data.buttonText) setButtonText(data.buttonText);
          if (data.name) setName(data.name);
          if (data.handle) setHandle(data.handle);
          if (data.bioShort) setBioShort(data.bioShort);
          if (data.coverUrl) {
            setCoverUrl(data.coverUrl);
            setCoverPreview(data.coverUrl);
          }
          if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
            setAvatarPreview(data.avatarUrl);
          }
        }
      })
      .catch((err) => console.error("Erro ao carregar:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRestoreDefault = () => {
    if (confirm("Deseja restaurar as configurações padrão da página de entrada?")) {
      setVideoUrl(DEFAULT_VIDEO);
      setVideoPreview(DEFAULT_VIDEO);
      setButtonText("QUENTES");
      setVideoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadStatus("Iniciando...");

    try {
      let finalVideoUrl = videoUrl;
      let finalCoverUrl = coverUrl;
      let finalAvatarUrl = avatarUrl;

      // 1. Upload do Vídeo de Demonstração diretamente para o Supabase Storage
      if (videoFile) {
        const sizeMb = (videoFile.size / (1024 * 1024)).toFixed(1);
        setUploadStatus(`Enviando vídeo (${sizeMb} MB)...`);
        
        const videoExt = videoFile.name.split(".").pop()?.toLowerCase() || "mp4";
        const videoFileName = `teaser-${Date.now()}.${videoExt}`;

        const { error: videoError } = await supabase.storage
          .from("videos")
          .upload(videoFileName, videoFile, {
            cacheControl: "3600",
            contentType: videoFile.type || "video/mp4",
            upsert: true,
          });

        if (videoError) {
          throw new Error("Erro no upload do vídeo para o Supabase: " + videoError.message);
        }

        const { data: { publicUrl: newVideoUrl } } = supabase.storage
          .from("videos")
          .getPublicUrl(videoFileName);

        finalVideoUrl = newVideoUrl;
      }

      // 2. Upload da Foto de Capa (se houver novo arquivo)
      if (coverFile) {
        setUploadStatus("Enviando foto de capa...");
        const coverExt = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const coverFileName = `cover-${Date.now()}.${coverExt}`;

        const { error: coverError } = await supabase.storage
          .from("videos")
          .upload(coverFileName, coverFile, {
            cacheControl: "3600",
            contentType: coverFile.type || "image/jpeg",
            upsert: true,
          });

        if (!coverError) {
          const { data: { publicUrl: newCoverUrl } } = supabase.storage
            .from("videos")
            .getPublicUrl(coverFileName);
          finalCoverUrl = newCoverUrl;
        } else {
          console.warn("Aviso no upload da capa:", coverError);
        }
      }

      // 3. Upload da Foto de Avatar (se houver novo arquivo)
      if (avatarFile) {
        setUploadStatus("Enviando avatar...");
        const avatarExt = avatarFile.name.split(".").pop()?.toLowerCase() || "png";
        const avatarFileName = `avatar-${Date.now()}.${avatarExt}`;

        const { error: avatarError } = await supabase.storage
          .from("videos")
          .upload(avatarFileName, avatarFile, {
            cacheControl: "3600",
            contentType: avatarFile.type || "image/png",
            upsert: true,
          });

        if (!avatarError) {
          const { data: { publicUrl: newAvatarUrl } } = supabase.storage
            .from("videos")
            .getPublicUrl(avatarFileName);
          finalAvatarUrl = newAvatarUrl;
        } else {
          console.warn("Aviso no upload do avatar:", avatarError);
        }
      }

      // 4. Salvar configurações na base / arquivo JSON de forma limpa e leve
      setUploadStatus("Salvando configurações...");
      const res = await fetch("/api/admin/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teaserVideoUrl: finalVideoUrl,
          coverUrl: finalCoverUrl,
          avatarUrl: finalAvatarUrl,
          buttonText,
          name,
          handle,
          bioShort,
        }),
      });

      const data = await res.json();
      if (data.success || !data.error) {
        setVideoUrl(finalVideoUrl);
        setVideoPreview(finalVideoUrl);
        setCoverUrl(finalCoverUrl);
        setCoverPreview(finalCoverUrl);
        setAvatarUrl(finalAvatarUrl);
        setAvatarPreview(finalAvatarUrl);

        setVideoFile(null);
        setCoverFile(null);
        setAvatarFile(null);

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        throw new Error(data.error || "Tente novamente.");
      }
    } catch (err: unknown) {
      console.error("Erro ao salvar:", err);
      const msg = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      alert("Erro ao salvar: " + msg);
    } finally {
      setIsSaving(false);
      setUploadStatus("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-8 px-4 select-none animate-fade-in">
      
      {/* ─── TOPO ─── */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-red-500" />
            Perfil da Modelo & Vídeo de Atração
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie o perfil da modelo, fotos, vídeo curto de demonstração e o botão transparente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
            title="Restaurar padrões"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>Ver no Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
        </div>
      </div>

      {/* Alerta de Sucesso */}
      {savedSuccess && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold">Alterações salvas com sucesso!</span>
          </div>
          <Link href="/" target="_blank" className="text-xs font-extrabold underline hover:text-emerald-300">
            Abrir página inicial →
          </Link>
        </div>
      )}

      {/* ─── FORMULÁRIO ─── */}
      <form onSubmit={handleSubmit} className="bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
        
        {/* ── SEÇÃO 1: VÍDEO DE ATRAÇÃO & BOTÃO (PROPORÇÃO 457 x 316) ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-zinc-800 pb-2">
            <Play className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Vídeo de Demonstração (457 x 316) & Botão Transparente</span>
          </div>

          <div
            style={{
              width: "100%",
              aspectRatio: "457 / 316",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#0d0d12",
              border: "1.5px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.7)",
            }}
          >
            <video
              key={videoPreview || videoUrl}
              src={videoPreview || videoUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Vinheta escura */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Botão Transparente Exatamente como Ficará */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.65)",
                  borderRadius: "9999px",
                  padding: "12px 28px",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "14px",
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
                  whiteSpace: "nowrap",
                }}
              >
                <Play style={{ width: "14px", height: "14px", fill: "#ffffff", color: "#ffffff" }} />
                <span>{buttonText || "QUENTES"}</span>
              </div>
            </div>
          </div>

          {/* Upload de Vídeo */}
          <div className="space-y-2">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />

            <button
              type="button"
              disabled={isSaving}
              onClick={() => videoInputRef.current?.click()}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 border border-zinc-700/80 rounded-xl text-xs font-bold text-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-red-500" />
              <span>Trocar Vídeo do Computador / Celular</span>
            </button>

            {/* Ficheiro selecionado com botão para remover */}
            {videoFile && (
              <div className="flex items-center justify-between px-3 py-2 bg-red-950/30 border border-red-800/50 rounded-xl text-xs text-red-300 animate-fade-in">
                <div className="flex items-center gap-2 truncate">
                  <VideoIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="font-semibold truncate">{videoFile.name}</span>
                  <span className="text-[11px] text-zinc-400 flex-shrink-0">
                    ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(videoUrl);
                  }}
                  className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 rounded transition-colors"
                  title="Cancelar vídeo selecionado"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Ou insira a URL direta do vídeo:
              </label>
              <input
                type="text"
                value={videoUrl}
                disabled={isSaving}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setVideoPreview(e.target.value);
                  setVideoFile(null);
                }}
                placeholder="https://exemplo.com/meu-video.mp4"
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 text-white text-xs rounded-xl px-4 py-2.5 font-mono focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Texto do Botão Transparente */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Texto do Botão Transparente
            </label>
            <input
              type="text"
              value={buttonText}
              disabled={isSaving}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="QUENTES"
              required
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 text-white font-black text-sm rounded-xl px-4 py-3 focus:outline-none uppercase tracking-wider transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* ── SEÇÃO 2: DADOS DO PERFIL DA MODELO ── */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-zinc-800 pb-2">
            <User className="w-4 h-4 text-sky-400" />
            <span>Perfil da Modelo (Fotos e Informações)</span>
          </div>

          {/* Upload Capa e Avatar lado a lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foto de Capa */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Foto de Capa
              </label>
              <div className="relative aspect-[457/216] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={coverPreview || coverUrl}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
              <button
                type="button"
                disabled={isSaving}
                onClick={() => coverInputRef.current?.click()}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Trocar Capa</span>
              </button>
              {coverFile && (
                <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-300">
                  <span className="truncate">{coverFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(coverUrl);
                    }}
                    className="text-zinc-500 hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Foto de Avatar */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Foto de Perfil (Avatar)
              </label>
              <div className="flex items-center justify-center aspect-[457/216] bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={avatarPreview || avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
              <button
                type="button"
                disabled={isSaving}
                onClick={() => avatarInputRef.current?.click()}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Trocar Avatar</span>
              </button>
              {avatarFile && (
                <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-300">
                  <span className="truncate">{avatarFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(avatarUrl);
                    }}
                    className="text-zinc-500 hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nome e Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase">
                Nome da Modelo
              </label>
              <input
                type="text"
                value={name}
                disabled={isSaving}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: carla reis"
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 text-white font-bold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase">
                Usuário (@handle)
              </label>
              <input
                type="text"
                value={handle}
                disabled={isSaving}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Ex: @carla"
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 text-white font-bold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Biografia Curta */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Frase da Bio
            </label>
            <input
              type="text"
              value={bioShort}
              disabled={isSaving}
              onChange={(e) => setBioShort(e.target.value)}
              placeholder="Ex: tudo que você precisa ver"
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* ── BOTÃO SALVAR COM STATUS ── */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-red-600 hover:bg-red-500 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{uploadStatus || "Salvando..."}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Salvar Todas as Alterações</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
