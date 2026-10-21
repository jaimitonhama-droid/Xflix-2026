import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "landing_page_config.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const DEFAULT_CONFIG = {
  coverUrl: "/images/model-cover.jpg",
  avatarUrl: "/images/model-avatar.png",
  name: "ZOEY CURLY💕",
  isVerified: true,
  handle: "@zoeycurly",
  statusText: "Disponível agora",
  bioShort: "Conteúdos exclusivos todos os dias",
  bioFull: "",
  buttonText: "EXCLUSIVOS",
  buttonBadge: "GRATUITO",
  buttonColor: "#00aff0",
  photosCount: "166",
  videosCount: "85",
  livesCount: "21",
  likesCount: "66.2K",
  tabPosts: "165 POSTAGENS",
  tabMedia: "251 MÍDIA",
  lockTitle: "Conteúdo exclusivo protegido",
  lockSubtitle: "Toque no botão EXCLUSIVOS para liberar todos os vídeos",
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

export async function GET() {
  const config = readConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Se for upload com FormData (ficheiro de imagem)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const currentConfig = readConfig();

      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      // Upload de Capa
      const coverFile = formData.get("coverFile") as File | null;
      if (coverFile && coverFile.size > 0) {
        const ext = coverFile.name.split(".").pop() || "jpg";
        const fileName = `cover-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const bytes = await coverFile.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(bytes));
        currentConfig.coverUrl = `/uploads/${fileName}`;
      }

      // Upload de Avatar
      const avatarFile = formData.get("avatarFile") as File | null;
      if (avatarFile && avatarFile.size > 0) {
        const ext = avatarFile.name.split(".").pop() || "png";
        const fileName = `avatar-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const bytes = await avatarFile.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(bytes));
        currentConfig.avatarUrl = `/uploads/${fileName}`;
      }

      // Upload de Vídeo de Demonstração
      const videoFile = formData.get("videoFile") as File | null;
      if (videoFile && videoFile.size > 0) {
        const ext = videoFile.name.split(".").pop() || "mp4";
        const fileName = `teaser-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const bytes = await videoFile.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(bytes));
        currentConfig.teaserVideoUrl = `/uploads/${fileName}`;
      }

      // Outros campos em texto
      for (const [key, value] of formData.entries()) {
        if (key !== "coverFile" && key !== "avatarFile" && key !== "videoFile" && typeof value === "string") {
          if (key === "isVerified") {
            currentConfig.isVerified = value === "true";
          } else {
            currentConfig[key] = value;
          }
        }
      }

      writeConfig(currentConfig);
      return NextResponse.json({ success: true, config: currentConfig });
    }

    // Se for JSON simples
    const body = await req.json();
    const currentConfig = readConfig();
    const updated = { ...currentConfig, ...body };
    writeConfig(updated);
    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    console.error("Erro na rota landing-page:", error);
    return NextResponse.json({ error: error.message || "Erro ao salvar" }, { status: 500 });
  }
}
