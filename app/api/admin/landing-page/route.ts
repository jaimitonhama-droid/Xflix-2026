import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const CONFIG_PATH = path.join(process.cwd(), "data", "landing_page_config.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const DEFAULT_CONFIG = {
  coverUrl: "/images/model-cover.jpg",
  avatarUrl: "/images/model-avatar.png",
  name: "carla reis",
  isVerified: true,
  handle: "carla",
  statusText: "Disponível agora",
  bioShort: "tudo que voce precisa ver",
  bioFull: "",
  buttonText: "QUENTES",
  buttonBadge: "GRATUITO",
  buttonColor: "#00aff0",
  photosCount: "166",
  videosCount: "85",
  livesCount: "21",
  likesCount: "66.2K",
  tabPosts: "165 POSTAGENS",
  tabMedia: "251 MÍDIA",
  lockTitle: "Conteúdo exclusivo protegido",
  lockSubtitle: "Toque no vídeo para liberar acesso",
  teaserVideoUrl: "https://gvcliwdhgqpbrbvehpsa.supabase.co/storage/v1/object/public/videos/1788193495732-video.mp4"
};

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Erro ao ler landing_page_config.json:", err);
  }
  return DEFAULT_CONFIG;
}

function writeConfig(config: any) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gvcliwdhgqpbrbvehpsa.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

export async function GET() {
  const config = readConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Garantir que a pasta de uploads local existe
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const currentConfig = readConfig();
    const supabase = getSupabase();

    // 1. Processamento via FormData (Upload seguro de arquivos)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      let uploadedCoverUrl: string | null = null;
      let uploadedAvatarUrl: string | null = null;
      let uploadedVideoUrl: string | null = null;

      // Upload da Foto de Capa
      const coverFile = formData.get("coverFile") as File | null;
      if (coverFile && coverFile.size > 0) {
        const rawExt = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const ext = rawExt.replace(/[^a-z0-9]/g, "");
        const fileName = `cover-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const bytes = await coverFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sempre salvar localmente primeiro (100% garantido e rápido)
        fs.writeFileSync(filePath, buffer);
        uploadedCoverUrl = `/uploads/${fileName}`;

        // Tentativa de espelhar para o Supabase Storage
        if (supabase) {
          try {
            const { error: supaErr } = await supabase.storage
              .from("videos")
              .upload(fileName, buffer, {
                contentType: coverFile.type || "image/jpeg",
                upsert: true,
              });

            if (!supaErr) {
              const { data: pubData } = supabase.storage
                .from("videos")
                .getPublicUrl(fileName);
              if (pubData?.publicUrl) {
                uploadedCoverUrl = pubData.publicUrl;
              }
            }
          } catch (supaEx) {
            console.warn("Fallback local ativo para capa:", supaEx);
          }
        }
      }

      // Upload da Foto de Perfil (Avatar)
      const avatarFile = formData.get("avatarFile") as File | null;
      if (avatarFile && avatarFile.size > 0) {
        const rawExt = avatarFile.name.split(".").pop()?.toLowerCase() || "png";
        const ext = rawExt.replace(/[^a-z0-9]/g, "");
        const fileName = `avatar-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sempre salvar localmente primeiro
        fs.writeFileSync(filePath, buffer);
        uploadedAvatarUrl = `/uploads/${fileName}`;

        // Tentativa de espelhar para o Supabase Storage
        if (supabase) {
          try {
            const { error: supaErr } = await supabase.storage
              .from("videos")
              .upload(fileName, buffer, {
                contentType: avatarFile.type || "image/png",
                upsert: true,
              });

            if (!supaErr) {
              const { data: pubData } = supabase.storage
                .from("videos")
                .getPublicUrl(fileName);
              if (pubData?.publicUrl) {
                uploadedAvatarUrl = pubData.publicUrl;
              }
            }
          } catch (supaEx) {
            console.warn("Fallback local ativo para avatar:", supaEx);
          }
        }
      }

      // Upload do Vídeo Teaser (se fornecido)
      const videoFile = formData.get("videoFile") as File | null;
      if (videoFile && videoFile.size > 0) {
        const rawExt = videoFile.name.split(".").pop()?.toLowerCase() || "mp4";
        const ext = rawExt.replace(/[^a-z0-9]/g, "");
        const fileName = `teaser-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        fs.writeFileSync(filePath, buffer);
        uploadedVideoUrl = `/uploads/${fileName}`;

        if (supabase) {
          try {
            const { error: supaErr } = await supabase.storage
              .from("videos")
              .upload(fileName, buffer, {
                contentType: videoFile.type || "video/mp4",
                upsert: true,
              });

            if (!supaErr) {
              const { data: pubData } = supabase.storage
                .from("videos")
                .getPublicUrl(fileName);
              if (pubData?.publicUrl) {
                uploadedVideoUrl = pubData.publicUrl;
              }
            }
          } catch (supaEx) {
            console.warn("Fallback local ativo para vídeo teaser:", supaEx);
          }
        }
      }

      // Atualizar outros campos de texto
      for (const [key, value] of formData.entries()) {
        if (key !== "coverFile" && key !== "avatarFile" && key !== "videoFile" && typeof value === "string") {
          if (key === "teaserVideoUrl" && uploadedVideoUrl) continue;
          if (key === "coverUrl" && uploadedCoverUrl) continue;
          if (key === "avatarUrl" && uploadedAvatarUrl) continue;

          if (key === "isVerified") {
            currentConfig.isVerified = value === "true";
          } else {
            (currentConfig as any)[key] = value;
          }
        }
      }

      if (uploadedCoverUrl) currentConfig.coverUrl = uploadedCoverUrl;
      if (uploadedAvatarUrl) currentConfig.avatarUrl = uploadedAvatarUrl;
      if (uploadedVideoUrl) currentConfig.teaserVideoUrl = uploadedVideoUrl;

      writeConfig(currentConfig);
      return NextResponse.json({ success: true, config: currentConfig });
    }

    // 2. Processamento via JSON
    const body = await req.json().catch(() => ({}));
    const updated = { ...currentConfig, ...body };
    writeConfig(updated);
    return NextResponse.json({ success: true, config: updated });

  } catch (error: any) {
    console.error("Erro na rota landing-page:", error);
    // Mesmo em caso de erro incomum, tenta retornar config atual sem travar o cliente
    const fallbackConfig = readConfig();
    return NextResponse.json({
      success: true,
      config: fallbackConfig,
      warning: error.message || "Erro parcial ao salvar",
    });
  }
}
