import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Webhook para receber confirmação de pagamento da Paysuite
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[Paysuite Webhook] Recebido:", body);

    // TODO: Ajustar a estrutura do `body` de acordo com a documentação oficial da Paysuite
    // Normalmente, um webhook de sucesso inclui status, referência e detalhes.
    const { status, reference, transaction_id } = body;

    if (status === "SUCCESS" || status === "COMPLETED") {
      // O reference foi definido na rota de payment, ex: sub_USERID_TIMESTAMP
      const parts = reference?.split("_");
      const userId = parts?.[1];

      if (userId) {
        // Inicializar Supabase Admin (para ter privilégios de atualizar a tabela)
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Calcula a data de expiração para 7 dias no futuro
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Atualizar o perfil do usuário
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_expires_at: expiresAt.toISOString()
          })
          .eq("user_id", userId);

        if (error) {
          console.error("[Webhook Error] Falha ao atualizar perfil no Supabase:", error);
          return NextResponse.json({ error: "Falha ao atualizar banco de dados" }, { status: 500 });
        }

        console.log(`[Webhook Sucesso] Assinatura renovada para o usuário ${userId}. Válida até ${expiresAt}`);
        return NextResponse.json({ success: true, message: "Assinatura ativada" });
      }
    }

    return NextResponse.json({ success: false, message: "Pagamento não confirmado ou status ignorado" });

  } catch (error: any) {
    console.error("Erro no Webhook Paysuite:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
