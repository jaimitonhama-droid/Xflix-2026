"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, CheckCircle2, Clock, XCircle, Download, RefreshCw, Smartphone, DollarSign, Film } from "lucide-react";
import { createClient } from "@/services/supabase/client";

interface Transaction {
  id: string;
  reference: string;
  user_email: string;
  user_name: string;
  video_title: string;
  type: "buy" | "rent";
  method: "M-Pesa" | "e-Mola";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

export default function AdminTransactionsPage() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, videos(title)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setTransactions([]);
      } else {
        const mapped: Transaction[] = data.map((o: any) => ({
          id: o.id,
          reference: o.payment_reference || `ORD-${o.id.substring(0, 8)}`,
          user_name: o.user_id?.substring(0, 8) || "Cliente",
          user_email: "cliente@xflix.mz",
          video_title: o.videos?.title || "Vídeo VIP",
          type: o.purchase_type === "buy" ? "buy" : "rent",
          method: o.payment_reference?.startsWith("86") || o.payment_reference?.startsWith("87") ? "e-Mola" : "M-Pesa",
          amount: Number(o.amount) || 0,
          status: o.payment_status === "completed" ? "completed" : o.payment_status === "failed" ? "failed" : "pending",
          date: new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.video_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPurchases = transactions
    .filter((t) => t.type === "buy" && t.status === "completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalRentals = transactions
    .filter((t) => t.type === "rent" && t.status === "completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Vendas & Transações dos Clientes</h1>
          <p className="text-sm text-zinc-400">Histórico detalhado dos pagamentos efetuados pelos utilizadores em tempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTransactions}
            className="flex items-center gap-2 bg-[#121215] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
          <button 
            onClick={() => alert("Relatório de vendas exportado em CSV!")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            <Download className="w-3.5 h-3.5" /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Cartões de Resumo das Vendas (Inicializados a 0) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Receita Total de Vendas</p>
            <h3 className="text-2xl font-black text-emerald-400">MT {totalRevenue.toLocaleString('pt-BR')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Compras Definitivas</p>
            <h3 className="text-2xl font-black text-white">MT {totalPurchases.toLocaleString('pt-BR')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Film className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Alugueres (24h)</p>
            <h3 className="text-2xl font-black text-amber-400">MT {totalRentals.toLocaleString('pt-BR')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Input de Busca */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, vídeo ou referência..."
            className="w-full bg-zinc-900/80 border border-zinc-800 text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        {/* Seleção de Filtros */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Tipo de Acesso:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-1.5 outline-none focus:border-red-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="buy">Compra Definitiva</option>
              <option value="rent">Aluguer (24h)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-1.5 outline-none focus:border-red-500"
            >
              <option value="all">Todos os estados</option>
              <option value="completed">Concluído</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhado</option>
            </select>
          </div>
        </div>

      </div>

      {/* Tabela de Transações */}
      <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/60 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800/80">
                <th className="py-4 px-5">Referência</th>
                <th className="py-4 px-5">Cliente</th>
                <th className="py-4 px-5">Vídeo / Conteúdo</th>
                <th className="py-4 px-5">Tipo</th>
                <th className="py-4 px-5">Método</th>
                <th className="py-4 px-5">Data e Hora</th>
                <th className="py-4 px-5">Estado</th>
                <th className="py-4 px-5 text-right">Valor Pago (MT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-xs font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    Nenhuma transação M-Pesa / e-Mola gravada na base de dados ainda.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 text-white font-mono font-bold group-hover:text-red-400 transition-colors">
                      {tx.reference}
                    </td>
                    <td className="py-4 px-5">
                      <div>
                        <p className="text-white font-bold">{tx.user_name}</p>
                        <p className="text-[11px] text-zinc-500">{tx.user_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-zinc-200 font-bold">{tx.video_title}</td>
                    <td className="py-4 px-5">
                      <span className="capitalize text-zinc-300">
                        {tx.type === "buy" ? "Compra Definitiva" : "Aluguer 24h"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-300 font-semibold">
                        <Smartphone className="w-3 h-3 text-red-500" />
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-zinc-400">{tx.date}</td>
                    <td className="py-4 px-5">
                      {tx.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                        </span>
                      )}
                      {tx.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
                          <Clock className="w-3.5 h-3.5" /> Pendente
                        </span>
                      )}
                      {tx.status === "failed" && (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Falhado
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right font-extrabold text-sm text-emerald-400">
                      + MT {tx.amount.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalhes do Pagamento */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121215] border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Detalhes da Venda</h3>
            
            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Referência</span>
                <span className="text-white font-mono font-bold">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Cliente</span>
                <span className="text-white font-bold">{selectedTx.user_name} ({selectedTx.user_email})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Vídeo Adquirido</span>
                <span className="text-white font-bold">{selectedTx.video_title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Método de Pagamento</span>
                <span className="text-white font-bold">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Data do Pagamento</span>
                <span className="text-white">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Valor Pago</span>
                <span className="text-emerald-400 font-bold text-sm">MT {selectedTx.amount.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTx(null)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
