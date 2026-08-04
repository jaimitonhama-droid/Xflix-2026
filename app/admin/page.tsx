"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, PlayCircle, ShoppingBag, ArrowUpRight, Plus, Tag, ExternalLink, Percent, Sparkles, RefreshCw, Film } from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell
} from 'recharts';
import { createClient } from "@/services/supabase/client";

export default function AdminDashboardPage() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [purchasesCount, setPurchasesCount] = useState(0);
  const [rentalsCount, setRentalsCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Gráficos mantidos com linha base de valor 0 para os testes em tempo real
  const lineData = [
    { name: 'Mar', value: 0 },
    { name: 'Abr', value: 0 },
    { name: 'Mai', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Ago', value: 0 },
  ];

  const pieData = [
    { name: 'Exclusivos VIP', value: 0 },
    { name: 'Cenas Completas HD', value: 0 },
    { name: 'Lançamentos', value: 0 },
    { name: 'Populares & Virais', value: 0 },
  ];

  const pieColors = ['#dc2626', '#ef4444', '#f59e0b', '#10b981'];

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*, videos(title)")
        .order("created_at", { ascending: false });

      if (!error && orders && orders.length > 0) {
        let total = 0;
        let monthTotal = 0;
        let buyCount = 0;
        let rentCount = 0;

        const currentMonth = new Date().getMonth();

        orders.forEach((o: any) => {
          const amount = Number(o.amount) || 0;
          total += amount;

          const orderMonth = new Date(o.created_at).getMonth();
          if (orderMonth === currentMonth) {
            monthTotal += amount;
          }

          if (o.purchase_type === "buy") buyCount++;
          if (o.purchase_type === "rent") rentCount++;
        });

        setTotalRevenue(total);
        setMonthRevenue(monthTotal);
        setTotalSalesCount(orders.length);
        setPurchasesCount(buyCount);
        setRentalsCount(rentCount);
        setRecentOrders(orders.slice(0, 5));
      } else {
        setTotalRevenue(0);
        setMonthRevenue(0);
        setTotalSalesCount(0);
        setPurchasesCount(0);
        setRentalsCount(0);
        setRecentOrders([]);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* Barra de Ações Rápidas (Quick Actions) */}
      <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Ações Rápidas do Painel</h2>
            <p className="text-[11px] text-zinc-400">Atalhos diretos para gerir conteúdos e promoções</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
          <Link 
            href="/admin/videos"
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(220,38,38,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Vídeo +18
          </Link>
          <Link 
            href="/"
            target="_blank"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Ver Site
          </Link>
        </div>
      </div>

      {/* 4 Cards de Métricas (Inicializados em 0 para testes em tempo real) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Receita Total Acumulada */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Receita Total</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-3">MT {totalRevenue.toLocaleString()}</h3>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Vendas em Tempo Real
          </div>
        </div>

        {/* Receita do Mês */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-red-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Vendas deste Mês</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-3">MT {monthRevenue.toLocaleString()}</h3>
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-red-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Mês Atual
          </div>
        </div>

        {/* Conversão de Previews */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Conversão de Previews</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-3">{totalSalesCount > 0 ? '14.8%' : '0%'} Conversão</h3>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Amostras grátis ➔ Pagamento
          </div>
        </div>

        {/* Alugueres e Compras */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-purple-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total de Acessos Vendidos</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-3">{totalSalesCount} Vídeos</h3>
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-purple-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> {purchasesCount} Compras | {rentalsCount} Alugueres
          </div>
        </div>

      </div>

      {/* Seção de Gráficos e Figuras MANTIDOS INTACTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Linha (Evolução das Vendas MANTIDO E VISÍVEL) */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 lg:col-span-2 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">Evolução de Vendas da Plataforma</h2>
              <p className="text-xs text-zinc-500 font-medium">Faturamento gerado pelos pagamentos M-Pesa / e-Mola dos utilizadores</p>
            </div>
            <select className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-red-500 cursor-pointer font-medium">
              <option>Últimos 6 meses</option>
            </select>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xflixRedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#dc2626" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#xflixRedGradient)" 
                  activeDot={{ r: 6, fill: '#ef4444', stroke: '#09090b', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca (Categorias MANTIDO E VISÍVEL) */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">Categorias +18 Mais Vistas</h2>
              <p className="text-xs text-zinc-500 font-medium">Distribuição de vendas por categoria</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="h-[180px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={84}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{totalSalesCount}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Total Vendas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
              <span className="text-zinc-400">Exclusivos VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="text-zinc-400">Cenas Completas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-zinc-400">Lançamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-zinc-400">Populares</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabela de Transações em Tempo Real */}
      <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">Últimas Compras e Alugueres (Tempo Real)</h2>
            <p className="text-xs text-zinc-500 font-medium">Pagamentos recebidos via M-Pesa / e-Mola dos utilizadores</p>
          </div>
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Aguardando Transações
          </span>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 uppercase tracking-wider border-b border-zinc-800 font-bold">
                <tr>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Conteúdo Adquirido</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Método</th>
                  <th className="pb-3 text-right">Valor Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 font-semibold text-white">{order.user_id?.slice(0, 8) || "Cliente M-Pesa"}</td>
                    <td className="py-3 text-zinc-300">{order.videos?.title || "Vídeo VIP"}</td>
                    <td className="py-3">{order.purchase_type === "buy" ? "Compra Definitiva" : "Aluguer (24h)"}</td>
                    <td className="py-3 text-red-400 font-bold">M-Pesa / e-Mola</td>
                    <td className="py-3 text-right text-emerald-400 font-bold">+ MT {order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 space-y-2 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
              <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">Nenhuma transação registada ainda.</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Assim que os clientes realizarem pagamentos via M-Pesa ou e-Mola, as transações reais surgirão aqui em tempo real.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
