import Link from "next/link";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

export default function CheckoutStatusPage({ params, searchParams }: { params: { status: string }, searchParams: { ref: string } }) {
  const { status } = params;
  const reference = searchParams.ref;

  let title = "Status Desconhecido";
  let message = "Não conseguimos determinar o status do seu pagamento.";
  let Icon = AlertCircle;
  let color = "text-zinc-500";

  switch (status) {
    case "pending":
      title = "Pagamento Pendente";
      message = "Por favor, aprove o pagamento no seu celular (e-Mola). Assim que for aprovado, seu vídeo será liberado automaticamente.";
      Icon = Clock;
      color = "text-yellow-500";
      break;
    case "success":
      title = "Pagamento Confirmado!";
      message = "Tudo certo! Seu acesso foi liberado. Divirta-se assistindo.";
      Icon = CheckCircle2;
      color = "text-green-500";
      break;
    case "cancelled":
      title = "Pagamento Cancelado";
      message = "Você cancelou a operação. Nenhuma cobrança foi feita.";
      Icon = XCircle;
      color = "text-zinc-500";
      break;
    case "failed":
      title = "Pagamento Falhou";
      message = "Houve um problema ao processar seu pagamento. Tente novamente mais tarde.";
      Icon = AlertCircle;
      color = "text-red-500";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 max-w-sm w-full">
        <div className={`mx-auto w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-lg ${color}`}>
          <Icon className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        {reference && (
          <div className="bg-black/50 py-2 px-4 rounded-lg mb-6 border border-zinc-800/50">
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-1">Referência</span>
            <span className="text-zinc-300 font-mono text-sm">{reference}</span>
          </div>
        )}

        <div className="space-y-3">
          {status === "success" ? (
            <Link 
              href="/library" 
              className="block w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
            >
              Ir para Minha Biblioteca
            </Link>
          ) : status === "pending" ? (
            <button 
              onClick={() => window.location.reload()}
              className="block w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-colors"
            >
              Já paguei (Atualizar)
            </button>
          ) : (
            <Link 
              href="/" 
              className="block w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-colors"
            >
              Voltar ao Início
            </Link>
          )}

          {status === "pending" && (
            <Link 
              href="/" 
              className="block w-full py-3 px-4 text-zinc-400 hover:text-white rounded-xl font-medium transition-colors"
            >
              Voltar ao Início
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
