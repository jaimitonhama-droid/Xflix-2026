import { NextResponse } from "next/server";

// Rota para iniciar o pagamento USSD Push (Paysuite)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, method, videoId, userId } = body;

    // Validação básica
    if (!phone || !method || !userId) {
      return NextResponse.json({ error: "Faltam parâmetros obrigatórios" }, { status: 400 });
    }

    // TODO: Implementar a chamada real à API da Paysuite aqui.
    // Exemplo de como seria a requisição para a Paysuite:
    /*
    const response = await fetch("https://api.paysuite.co.mz/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYSUITE_API_KEY}`
      },
      body: JSON.stringify({
        amount: 25, // Valor fixo da assinatura
        phone: phone,
        network: method.toUpperCase(), // 'MPESA' ou 'EMOLA'
        reference: `sub_${userId}_${Date.now()}`,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paysuite/webhook`
      })
    });
    const result = await response.json();
    */

    // Simulação temporária de sucesso imediato
    console.log(`[Mock Paysuite] Pedido de pagamento recebido para o número ${phone} via ${method}. Valor: 25 MT.`);

    return NextResponse.json({ 
      success: true, 
      message: "Pedido de pagamento iniciado. Por favor, confirme no seu telemóvel.",
      // A Paysuite normalmente retorna um tx_id (ID da transação)
      transaction_id: `tx_mock_${Date.now()}` 
    });

  } catch (error: any) {
    console.error("Erro na rota de pagamento Paysuite:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
