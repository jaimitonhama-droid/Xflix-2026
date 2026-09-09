import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";

const NETSHOP_API_URL = "https://www.netshop.co.mz/api/v1";
const NETSHOP_API_KEY = process.env.NETSHOP_API_KEY;
const NETSHOP_WALLET_ID = process.env.NETSHOP_WALLET_ID;
const VIP_PRICE = 25; // 25 MT para o plano VIP

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Autenticar utilizador
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      // Para testes locais sem sessão, podemos permitir um bypass se não houver auth obrigatório ainda,
      // mas num sistema de pagamentos real, é preciso ter sessão.
      return NextResponse.json({ error: "Não autorizado. Por favor, faça login." }, { status: 401 });
    }

    // 2. Extrair dados
    const body = await req.json();
    const { phone, method } = body;

    if (!phone || !method) {
      return NextResponse.json({ error: "Número de telemóvel e método são obrigatórios." }, { status: 400 });
    }

    if (!NETSHOP_API_KEY || !NETSHOP_WALLET_ID) {
      console.warn("Chaves da NetShop ausentes. Certifique-se de configurar NETSHOP_API_KEY e NETSHOP_WALLET_ID.");
      return NextResponse.json({ error: "Gateway de pagamentos temporariamente indisponível (Chaves ausentes)." }, { status: 503 });
    }

    // 3. Criar a "Order" na base de dados com status "pending"
    // Usamos um id gerado pelo Supabase ou geramos um reference local
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        video_id: null, // Porque é uma assinatura VIP geral, não atrelada a um vídeo
        purchase_type: "vip",
        payment_status: "pending",
        amount: VIP_PRICE,
        payment_reference: null // Será atualizado caso o NetShop retorne um ID específico
      })
      .select()
      .single();

    if (dbError || !order) {
      throw new Error("Erro ao criar registo de pagamento na base de dados: " + (dbError?.message || "Desconhecido"));
    }

    // 4. Invocar a API da NetShop
    // Nota: O payload exato depende da documentação final, assumindo um padrão comum
    const netshopResponse = await fetch(`${NETSHOP_API_URL}/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NETSHOP_API_KEY}`,
        "X-Wallet-ID": NETSHOP_WALLET_ID,
        "Idempotency-Key": order.id // Evita duplicação se houver timeout
      },
      body: JSON.stringify({
        amount: VIP_PRICE,
        method: method, // ex: "m-pesa" ou "e-mola"
        msisdn: phone.startsWith("258") ? phone : `258${phone}`,
        reference: order.id,
        description: "Assinatura VIP Xflix - 7 Dias",
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/netshop` // Para receber atualizações assíncronas
      })
    });

    if (!netshopResponse.ok) {
      const errorData = await netshopResponse.json().catch(() => null);
      console.error("NetShop API Error:", errorData || netshopResponse.statusText);
      
      // Atualizar order para failed
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);

      return NextResponse.json({ error: "Erro ao processar o pagamento com a NetShop." }, { status: netshopResponse.status });
    }

    const netshopData = await netshopResponse.json();

    // Se a NetShop retornar um Transaction ID ou Reference, guardamos.
    if (netshopData.id || netshopData.transaction_id) {
        await supabase.from("orders").update({ 
            payment_reference: netshopData.id || netshopData.transaction_id 
        }).eq("id", order.id);
    }

    // 5. Retornar sucesso para o frontend (aguardando confirmação USSD Push)
    return NextResponse.json({ 
      success: true, 
      message: "Pedido enviado. Confirme o pagamento no seu telemóvel.",
      order_id: order.id,
      netshop_response: netshopData
    });

  } catch (error: any) {
    console.error("Erro no checkout VIP:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
