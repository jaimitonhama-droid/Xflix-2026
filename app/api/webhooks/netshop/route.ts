import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";

// Nota: Em produção, deves validar o HMAC signature do webhook usando o segredo (whsec_...)
// Aqui estamos a implementar a lógica principal assumindo que a assinatura está validada.

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    
    // O webhook da NetShop envia o tipo de evento
    const eventType = body.event;
    const data = body.data;

    if (eventType === "charge.paid") {
      // O 'reference' que enviamos na criação da cobrança volta aqui
      const orderId = data.reference;

      if (!orderId) {
        console.error("Webhook recebido sem reference (orderId).", data);
        return NextResponse.json({ error: "No reference provided" }, { status: 400 });
      }

      // 1. Marcar a order como paga
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", orderId)
        .select()
        .single();

      if (orderError || !order) {
        console.error("Erro ao atualizar a order:", orderError);
        return NextResponse.json({ error: "Order not found or update failed" }, { status: 404 });
      }

      // 2. Atualizar o perfil do utilizador para VIP ativo + 7 dias
      if (order.purchase_type === "vip" && order.user_id) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // VIP por 7 dias

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_expires_at: expiresAt.toISOString(),
          })
          .eq("user_id", order.user_id);

        if (profileError) {
          console.error("Erro ao atualizar o perfil do utilizador:", profileError);
        } else {
          console.log(`Utilizador ${order.user_id} atualizado para VIP até ${expiresAt.toISOString()}`);
        }
      }

      return NextResponse.json({ success: true, message: "Pagamento processado com sucesso." });
    }

    if (eventType === "charge.failed") {
       const orderId = data.reference;
       if (orderId) {
          await supabase.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
       }
       return NextResponse.json({ success: true, message: "Pagamento falhado registado." });
    }

    // Outros eventos são ignorados com 200 OK
    return NextResponse.json({ success: true, message: "Evento não processado mas recebido." });

  } catch (error: any) {
    console.error("Erro no processamento do webhook NetShop:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
