import { NextResponse } from "next/server";
import { adminDb } from "@/services/firebase/admin";

// POST: Chamado pelo cliente (Frontend) quando o Paywall é aberto.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { videoId, action } = body;

    // Registra a intenção no banco de dados. 
    // Em um sistema real, você pegaria o e-mail ou telefone do usuário autenticado (se houver).
    await adminDb.collection("abandoned_carts").add({
      videoId: videoId || null,
      action: action || "opened_paywall",
      status: "pending", // pending = ainda não comprou, nem enviamos email
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar carrinho abandonado:", error);
    return NextResponse.json({ error: "Falha ao registrar." }, { status: 500 });
  }
}

// GET: Rota Cron para ser chamada automaticamente (Ex: Vercel Cron de hora em hora)
export async function GET(req: Request) {
  try {
    // 1. Busca carrinhos pendentes que foram criados há mais de 1 hora
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const snapshot = await adminDb.collection("abandoned_carts")
      .where("status", "==", "pending")
      .where("created_at", "<", oneHourAgo)
      .limit(50) // Processa em lotes para evitar sobrecarga
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "Nenhum carrinho abandonado encontrado." });
    }

    const processedIds: string[] = [];

    // 2. Itera sobre os registros pendentes
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // AQUI VOCÊ ADICIONA A LÓGICA DE ENVIO DE E-MAIL OU SMS
      // Exemplo: await sendEmail({ to: data.userEmail, subject: "Volte e termine sua compra!" });
      console.log(`Simulando envio de email de recuperação para o registro: ${doc.id}`);

      // 3. Marca como processado
      await doc.ref.update({
        status: "processed",
        processed_at: new Date().toISOString()
      });

      processedIds.push(doc.id);
    }

    return NextResponse.json({ 
      success: true, 
      processed_count: processedIds.length,
      processed_ids: processedIds 
    });

  } catch (error) {
    console.error("Erro no Cron de carrinhos abandonados:", error);
    return NextResponse.json({ error: "Falha ao processar carrinhos." }, { status: 500 });
  }
}
