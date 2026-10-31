import fs from "fs";
import path from "path";
import ModelProfileClient from "./ModelProfileClient";

export const dynamic = "force-dynamic";

// Configuração padrão oficial caso o arquivo ainda não tenha sido lido
const DEFAULT_HELENA_CONFIG = {
  coverUrl: "/uploads/cover-1793477569791.jpeg",
  avatarUrl: "/uploads/avatar-1793477573183.jpeg",
  name: "Helena",
  isVerified: true,
  handle: "VIP",
  statusText: "Disponível agora",
  bioShort: "",
  bioFull: "",
  buttonText: "+ videos",
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
  teaserVideoUrl: "/uploads/teaser-1793477576090.mp4"
};

function getLandingConfig() {
  try {
    const configPath = path.join(process.cwd(), "data", "landing_page_config.json");
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf8");
      return { ...DEFAULT_HELENA_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Erro ao ler landing_page_config.json:", err);
  }
  return DEFAULT_HELENA_CONFIG;
}

export default async function Page() {
  const config = getLandingConfig();
  return <ModelProfileClient initialData={config} />;
}
