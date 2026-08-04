"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/services/supabase/server";
import { initiatePayment } from "@/services/payment/paysuite";

export async function processCheckout(formData: FormData) {
  const supabase = await createClient();
  
  // Obter sessão do usuário
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const videoId = formData.get("videoId") as string;
  const paymentType = formData.get("paymentType") as "buy" | "rent";
  const phone = formData.get("phone") as string;
  
  if (!videoId || !paymentType || !phone) {
    return { error: "Preencha todos os dados corretamente." };
  }

  // 1. Buscar os detalhes do vídeo para saber o valor
  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("price, rental_price, title")
    .eq("id", videoId)
    .single();

  if (videoError || !video) {
    return { error: "Vídeo não encontrado." };
  }

  const amount = paymentType === "buy" ? video.price : video.rental_price;
  const reference = `ORD-${Date.now()}-${user.id.substring(0, 5)}`;

  // 2. Inserir Pedido Pendente no Banco de Dados
  const { error: orderError } = await supabase.from("orders").insert({
    user_id: user.id,
    video_id: videoId,
    purchase_type: paymentType,
    payment_status: "pending",
    amount: amount,
    payment_reference: reference
  });

  if (orderError) {
    console.error("Erro ao criar pedido:", orderError);
    return { error: "Erro ao processar pedido no banco de dados." };
  }

  // 3. Enviar para a PaySuite
  const response = await initiatePayment({
    reference,
    amount,
    phone,
    description: `${paymentType === 'buy' ? 'Compra' : 'Aluguel'} de: ${video.title}`
  });

  if (!response.success) {
    // Falhou em contatar a PaySuite, atualiza pedido
    await supabase.from("orders").update({ payment_status: "failed" }).eq("payment_reference", reference);
    redirect(`/checkout/failed?ref=${reference}`);
  }

  // 4. Redirecionar para tela de pendente aguardando webhook
  redirect(response.statusUrl || `/checkout/pending?ref=${reference}`);
}
