"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Lock,
  Home,
  MoreHorizontal,
  Play,
} from "lucide-react";

export default function ModelProfileClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  // Revalidação em background suave (sem alterar imagens se forem iguais)
  useEffect(() => {
    fetch("/api/admin/landing-page")
      .then((res) => res.json())
      .then((config) => {
        if (config && !config.error) {
          setData((prev: any) => ({ ...prev, ...config }));
        }
      })
      .catch(() => {});
  }, []);

  const handleEnterVideos = () => {
    router.push("/videos");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        maxHeight: "100vh",
        backgroundColor: "#07070a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── BRILHO DE FUNDO DISCRETO NO PC ─── */}
      <div
        style={{
          position: "fixed",
          width: "450px",
          height: "450px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(0, 175, 240, 0.08) 0%, rgba(239, 68, 68, 0.05) 50%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ─── CONTAINER PRINCIPAL (CABE 100% NA TELA SEM ROLAR) ─── */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          height: "100%",
          maxHeight: "100vh",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* ─── BLOCO SUPERIOR: CAPA + AVATAR + INFORMAÇÕES DO PERFIL ─── */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
          
          {/* 1. Foto de Capa (Carregamento Imediato com Alta Prioridade) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "165px",
              backgroundColor: "#18181b",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {data.coverUrl && (
              <img
                src={data.coverUrl}
                alt={`${data.name} Cover`}
                fetchPriority="high"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
          </div>

          {/* 2. Avatar Circular com Status Online */}
          <div
            style={{
              padding: "0 16px",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              marginTop: "-38px",
              zIndex: 20,
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "9999px",
                  border: "3px solid #ffffff",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                  backgroundColor: "#18181b",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {data.avatarUrl && (
                  <img
                    src={data.avatarUrl}
                    alt={`${data.name} Avatar`}
                    fetchPriority="high"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </div>

              {/* Ponto Verde Online */}
              <span
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "9999px",
                  backgroundColor: "#24d166",
                  border: "2px solid #ffffff",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                }}
                title="Disponível agora"
              />
            </div>
          </div>

          {/* 3. Informações da Modelo */}
          <div style={{ padding: "8px 16px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
            {/* Nome e Selo Verificado */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h1
                style={{
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {data.name}
              </h1>
              {data.isVerified && (
                <CheckCircle2
                  style={{
                    width: "17px",
                    height: "17px",
                    fill: "#00aff0",
                    color: "#ffffff",
                  }}
                />
              )}
            </div>

            {/* Handle e Status */}
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0, fontWeight: 500 }}>
              @{data.handle?.replace(/^@/, "")} <span style={{ margin: "0 4px" }}>•</span> <span style={{ color: "#475569", fontWeight: 600 }}>{data.statusText || "Disponível agora"}</span>
            </p>

            {/* Biografia */}
            {data.bioShort && (
              <div style={{ paddingTop: "4px", fontSize: "12px", color: "#334155", lineHeight: "1.4" }}>
                <p style={{ margin: 0, fontWeight: 500 }}>
                  {data.bioShort}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── LINHA DIVISÓRIA SUTIL COM ESPAÇAMENTO EQUILIBRADO ─── */}
        <div
          style={{
            margin: "8px 0 6px 0",
            height: "1px",
            backgroundColor: "#f1f5f9",
            flexShrink: 0,
          }}
        />

        {/* ─── BLOCO DO MEIO: VÍDEO INTEGRADO À PÁGINA (ESTILO POST NATIVO) ─── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 12px",
            minHeight: 0,
          }}
        >
          <div
            onClick={handleEnterVideos}
            style={{
              width: "100%",
              aspectRatio: "457 / 316",
              maxHeight: "36vh",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#0d0d12",
              border: "1px solid #e2e8f0",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
              cursor: "pointer",
              margin: "0 auto",
            }}
            className="group"
          >
            {/* Vídeo com Preload Instantâneo e Poster da Capa para nunca ficar preto */}
            <video
              src={data.teaserVideoUrl}
              poster={data.coverUrl}
              preload="auto"
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

            {/* Vinheta suave para dar contraste perfeito ao botão */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                transition: "background 0.2s ease",
              }}
              className="group-hover:bg-black/35"
            />

            {/* BOTÃO TRANSPARENTE / GLASSMORPHIC CENTRALIZADO NO VÍDEO */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
                pointerEvents: "auto",
              }}
            >
              <button
                id="btn-exclusivos-transparente"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterVideos();
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.7)",
                  borderRadius: "9999px",
                  padding: "11px 26px",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "13px",
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  whiteSpace: "nowrap",
                }}
                className="hover:scale-105 active:scale-95 hover:bg-white/30"
              >
                <Play style={{ width: "15px", height: "15px", fill: "#ffffff", color: "#ffffff" }} />
                <span>{data.buttonText || "+ VIDEOS"}</span>
              </button>
            </div>
          </div>

          {/* Barra elegante de Conteúdo Exclusivo Protegido */}
          <div
            onClick={handleEnterVideos}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              marginTop: "8px",
              backgroundColor: "#f8fafc",
              border: "1px solid #eef2f6",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            className="hover:bg-slate-100"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "8px",
                  backgroundColor: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Lock style={{ width: "13px", height: "13px", color: "#475569" }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                {data.lockTitle || "Conteúdo exclusivo protegido"}
              </span>
            </div>

            <span style={{ fontSize: "11px", fontWeight: 800, color: "#00aff0", display: "flex", alignItems: "center", gap: "2px" }}>
              Liberar vídeos →
            </span>
          </div>
        </div>

        {/* ─── BLOCO INFERIOR: BARRA DE NAVEGAÇÃO MOBILE ─── */}
        <div
          style={{
            height: "46px",
            borderTop: "1px solid #f1f5f9",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#94a3b8",
            backgroundColor: "#ffffff",
            flexShrink: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={handleEnterVideos}
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Início"
          >
            <Home style={{ width: "21px", height: "21px", strokeWidth: 2.2 }} />
          </button>

          <button
            onClick={handleEnterVideos}
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Mais Opções"
          >
            <MoreHorizontal style={{ width: "21px", height: "21px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
