// ============================================================
// XFLIX — WhatsApp Link Generator
// Gera links automáticos com mensagem formatada para cada pacote
// ============================================================

export interface Pacote {
  nome: string;
  quantidadeVideos: number;
  tamanho?: string;
  qualidade?: string;
  preco: number;
  precoOriginal?: number;
  descricao?: string;
}

/**
 * Formata e garante o código de Moçambique (258) no número do WhatsApp
 */
export function obterNumeroWhatsApp(): string {
  const envNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "258866269907";
  const limpo = envNum.replace(/\D/g, "");
  if (limpo.length === 9 && limpo.startsWith("8")) {
    return `258${limpo}`;
  }
  return limpo || "258866269907";
}

/**
 * Gera um link de WhatsApp com mensagem automática sobre o pacote escolhido.
 */
export function gerarLinkWhatsApp(pacote: Pacote): string {
  const numero = obterNumeroWhatsApp();

  const desconto = pacote.precoOriginal
    ? Math.round(((pacote.precoOriginal - pacote.preco) / pacote.precoOriginal) * 100)
    : 0;

  const mensagem = [
    `Olá! Tenho interesse no seguinte pacote do Xflix: 👇`,
    ``,
    `📁 *Pacote:* ${pacote.nome}`,
    `🎬 *Quantidade:* ${pacote.quantidadeVideos} vídeos exclusivos`,
    pacote.qualidade ? `📺 *Qualidade:* ${pacote.qualidade}` : null,
    pacote.tamanho ? `💾 *Tamanho total:* ${pacote.tamanho}` : null,
    desconto > 0 ? `🏷️ *Desconto:* ${desconto}% OFF` : null,
    `💰 *Valor:* ${pacote.preco} MT`,
    ``,
    `Como posso pagar via M-Pesa ou e-Mola?`,
  ]
    .filter(Boolean)
    .join("\n");

  const mensagemCodificada = encodeURIComponent(mensagem);
  return `https://wa.me/${numero}?text=${mensagemCodificada}`;
}

/**
 * Gera um link de WhatsApp para suporte geral.
 */
export function gerarLinkSuporte(): string {
  const numero = obterNumeroWhatsApp();
  const mensagem = encodeURIComponent(
    "Olá! Gostaria de tirar uma dúvida sobre o Xflix. Pode me ajudar? 😊"
  );
  return `https://wa.me/${numero}?text=${mensagem}`;
}

