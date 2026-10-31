import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const avatarFile = formData.get("avatarFile") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!avatarFile || avatarFile.size === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const rawExt = avatarFile.name.split(".").pop()?.toLowerCase() || "png";
    const ext = rawExt.replace(/[^a-z0-9]/g, "");
    const fileName = `user-avatar-${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);
    let finalUrl = `/uploads/${fileName}`;

    // Tentativa de espelhar para o Supabase Storage se credenciais disponíveis
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        const supabase = createClient(url, key);
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
            finalUrl = pubData.publicUrl;
          }
        }

        // Se tiver userId, atualizar na tabela profiles
        if (userId) {
          await supabase
            .from("profiles")
            .update({ avatar_url: finalUrl, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
        }
      } catch (e) {
        console.warn("Aviso no espelho do Supabase para avatar:", e);
      }
    }

    return NextResponse.json({ success: true, avatar_url: finalUrl });
  } catch (error: any) {
    console.error("Erro no upload de avatar:", error);
    return NextResponse.json({ error: error.message || "Falha no upload" }, { status: 500 });
  }
}

