import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // Verificar token secreto (Opcional, dependendo da PaySuite)
    const authHeader = req.headers.get("Authorization");
    const webhookSecret = process.env.PAYSUITE_WEBHOOK_SECRET;

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { reference, status } = payload; // Adapte para o JSON exato da PaySuite

    if (!reference || !status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Como Webhooks rodam no servidor de fundo, usamos o Supabase Client normal
    // com a Service Role Key para ignorar RLS temporariamente e atualizar a base.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANTE: Precisará adicionar essa chave no env para webhooks
    );

    // 1. Atualizar o Pedido (Order)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({ payment_status: status === "success" ? "completed" : "failed" })
      .eq("payment_reference", reference)
      .select("*")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Se falhou, apenas retornamos sucesso no recebimento do Webhook
    if (status !== "success") {
      return NextResponse.json({ received: true, status: "failed" });
    }

    // 3. Se sucesso, liberar o vídeo na Biblioteca (Library)
    const isRent = order.purchase_type === "rent";
    
    let expiresAt = null;
    if (isRent) {
      // 24 horas a partir de agora
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      expiresAt = tomorrow.toISOString();
    }

    const { error: libraryError } = await supabase.from("library").upsert({
      user_id: order.user_id,
      video_id: order.video_id,
      purchase_type: order.purchase_type,
      expires_at: expiresAt,
      can_download: !isRent // Se comprou (buy) = true, se alugou = false
    }, { onConflict: "user_id,video_id" });

    if (libraryError) {
      console.error("Erro ao adicionar na biblioteca:", libraryError);
      return NextResponse.json({ error: "Failed to add to library" }, { status: 500 });
    }

    return NextResponse.json({ received: true, status: "completed" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
