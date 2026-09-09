"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, PlayCircle, ShoppingBag, ArrowUpRight, Plus, ExternalLink, Percent, Sparkles, RefreshCw, Bell, Download, CheckCircle2 } from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell
} from 'recharts';
import { createClient } from "@/services/supabase/client";

const MOCK_ORDERS = (() => {
  const mockOrders = [
    { id: "1", phone_number: "841234567", amount: 25, payment_method: "M-Pesa", status: "completed", created_at: new Date().toISOString() },
    { id: "2", phone_number: "869876543", amount: 25, payment_method: "e-Mola", status: "completed", created_at: new Date().toISOString() },
    { id: "3", phone_number: "845554443", amount: 25, payment_method: "M-Pesa", status: "pending", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "4", phone_number: "847778889", amount: 25, payment_method: "M-Pesa", status: "completed", created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: "5", phone_number: "863332221", amount: 25, payment_method: "e-Mola", status: "completed", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "6", phone_number: "841112223", amount: 25, payment_method: "M-Pesa", status: "failed", created_at: new Date(Date.now() - 172800000).toISOString() },
  ];
  for(let i=0; i<45; i++) {
      mockOrders.push({
          id: `mock-${i}`,
          phone_number: `84${Math.floor(Math.random() * 10000000)}`,
          amount: 25,
          payment_method: Math.random() > 0.3 ? "M-Pesa" : "e-Mola",
          status: "completed",
          created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      });
  }
  return mockOrders;
})();

export default function AdminDashboardPage() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  
  const [totalRevenue, setTotalRevenue] = useState(1275);
  const [periodRevenue, setPeriodRevenue] = useState(1275);
  const [totalSalesCount, setTotalSalesCount] = useState(51);
  const [activeSubscribers, setActiveSubscribers] = useState(51);
  const [mpesaCount, setMpesaCount] = useState(35);
  const [emolaCount, setEmolaCount] = useState(16);
  const [recentOrders, setRecentOrders] = useState<any[]>(MOCK_ORDERS.slice(0,5));
  const [allOrders, setAllOrders] = useState<any[]>(MOCK_ORDERS);

  // Dados de simulação para o gráfico de linha (Evolução de Vendas)
  const lineData = [
    { name: 'Mar', value: 4500 },
    { name: 'Abr', value: 8200 },
    { name: 'Mai', value: 6500 },
    { name: 'Jun', value: 12500 },
    { name: 'Jul', value: 18000 },
    { name: 'Ago', value: 24500 },
  ];

  const pieData = [
    { name: 'M-Pesa', value: mpesaCount > 0 ? mpesaCount : 0 },
    { name: 'e-Mola', value: emolaCount > 0 ? emolaCount : 0 },
  ];

  // Vermelho para M-Pesa, Laranja para e-Mola
  const pieColors = ['#dc2626', '#f97316'];

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*, videos(title)")
        .order("created_at", { ascending: false });

      if (!error && orders && orders.length > 0) {
        setAllOrders(orders);
        calculateMetrics(orders, dateRange);
      } else {
        // SIMULAÇÃO: Injetar dados falsos se a BD estiver vazia
        const mockOrders = [
          { id: "1", phone_number: "841234567", amount: 25, payment_method: "M-Pesa", status: "completed", created_at: new Date().toISOString() },
          { id: "2", phone_number: "869876543", amount: 25, payment_method: "e-Mola", status: "completed", created_at: new Date().toISOString() },
          { id: "3", phone_number: "845554443", amount: 25, payment_method: "M-Pesa", status: "pending", created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: "4", phone_number: "847778889", amount: 25, payment_method: "M-Pesa", status: "completed", created_at: new Date(Date.now() - 7200000).toISOString() },
          { id: "5", phone_number: "863332221", amount: 25, payment_method: "e-Mola", status: "completed", created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: "6", phone_number: "841112223", amount: 25, payment_method: "M-Pesa", status: "failed", created_at: new Date(Date.now() - 172800000).toISOString() },
        ];
        
        // Vamos adicionar mais 45 orders antigos para dar volume
        for(let i=0; i<45; i++) {
            mockOrders.push({
                id: `mock-${i}`,
                phone_number: `84${Math.floor(Math.random() * 10000000)}`,
                amount: 25,
                payment_method: Math.random() > 0.3 ? "M-Pesa" : "e-Mola",
                status: "completed",
                created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
            });
        }
        
        setAllOrders(mockOrders);
        calculateMetrics(mockOrders, dateRange);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (orders: any[], range: string) => {
    let total = 0;
    let periodTotal = 0;
    let mpesa = 0;
    let emola = 0;

    const today = new Date();
    let startDate = new Date(0); // all time

    if (range === "today") {
      startDate = new Date(today.setHours(0,0,0,0));
    } else if (range === "week") {
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const filteredOrders = orders.filter(o => new Date(o.created_at) >= startDate);

    orders.forEach(o => {
      if (o.status === "completed" || !o.status) {
        total += Number(o.amount) || 0;
      }
    });

    filteredOrders.forEach((o: any) => {
      if (o.status === "completed" || !o.status) {
        periodTotal += Number(o.amount) || 0;
      }
      if (o.payment_method?.toLowerCase().includes("emola") || o.payment_method?.toLowerCase().includes("e-mola")) {
        emola++;
      } else {
        mpesa++; // Default to M-Pesa se não houver método
      }
    });

    setTotalRevenue(total);
    setPeriodRevenue(periodTotal);
    setTotalSalesCount(filteredOrders.length);
    setActiveSubscribers(filteredOrders.length);
    setMpesaCount(mpesa);
    setEmolaCount(emola);
    setRecentOrders(filteredOrders.slice(0, 5));
  };

  const resetMetrics = () => {
    setTotalRevenue(0);
    setPeriodRevenue(0);
    setTotalSalesCount(0);
    setActiveSubscribers(0);
    setMpesaCount(0);
    setEmolaCount(0);
    setRecentOrders([]);
    setAllOrders([]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (allOrders.length > 0) {
      calculateMetrics(allOrders, dateRange);
    }
  }, [dateRange]);

  const handleExportCSV = () => {
    if (allOrders.length === 0) return;
    
    const headers = "ID,Cliente,Video,Tipo,Metodo,Valor,Data\n";
    const csvContent = allOrders.map(o => {
      const client = o.user_id ? o.user_id.slice(0, 8) : "Cliente";
      const video = o.videos?.title || "Video VIP";
      const type = o.purchase_type === "buy" ? "Compra" : "Aluguer";
      const amount = o.amount || 0;
      const date = new Date(o.created_at).toLocaleDateString();
      return `${o.id},${client},"${video}",${type},M-Pesa/e-Mola,${amount},${date}`;
    }).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `exportacao_vendas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* Saudação do Painel */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight flex items-center gap-2" style={{ marginLeft: '8px' }}>
          Bem-vindo Criador
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-1" style={{ marginLeft: '8px' }}>Aqui está a visão geral das métricas e receita do Xflix hoje.</p>
      </div>

      {/* Barra de Ações Rápidas (Quick Actions) */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600/20 to-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-tight">Painel de Gestão</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                API M-Pesa Online
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="flex-1 sm:flex-none bg-black/40 border border-white/10 text-[11px] text-white rounded-xl px-2.5 py-2.5 sm:py-1.5 outline-none focus:border-red-500 cursor-pointer font-medium hover:bg-black/60 transition-colors"
          >
            <option value="today">Hoje</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Este Mês</option>
            <option value="all">Todo o Tempo</option>
          </select>
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

          <button 
            onClick={fetchDashboardData}
            className="w-10 h-10 sm:w-8 sm:h-8 flex shrink-0 items-center justify-center bg-black/40 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-xl transition-all"
            title="Atualizar Dados"
          >
            <RefreshCw className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <Link 
            href="/admin/videos"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-3 py-2.5 sm:py-1.5 rounded-xl text-[11px] transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Adicionar Vídeo
          </Link>
        </div>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Receita Total Acumulada */}
        <div className="bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 hover:-translate-y-0.5 hover:shadow-2xl rounded-xl p-3 sm:p-4 relative overflow-hidden group transition-all duration-300 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-1">
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase leading-tight" style={{ marginLeft: '8px' }}>Receita Total</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-2xl font-black text-white mb-2 sm:mb-3" style={{ marginLeft: '8px' }}>MT {totalRevenue.toLocaleString()}</h3>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> <span className="truncate">Todo o Tempo</span>
            </div>
          </div>
        </div>

        {/* Receita do Período */}
        <div className="bg-zinc-900/40 border border-white/5 hover:border-red-500/30 hover:-translate-y-0.5 hover:shadow-2xl rounded-xl p-3 sm:p-4 relative overflow-hidden group transition-all duration-300 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-1">
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase leading-tight" style={{ marginLeft: '8px' }}>Receita ({dateRange === 'today' ? 'Hoje' : dateRange === 'week' ? '7d' : dateRange === 'month' ? 'Mês' : 'All'})</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] transition-all">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-2xl font-black text-white mb-2 sm:mb-3" style={{ marginLeft: '8px' }}>MT {periodRevenue.toLocaleString()}</h3>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-red-500/10 border border-red-500/20 px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-red-400 uppercase tracking-wider">
              <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> <span className="truncate">Período</span>
            </div>
          </div>
        </div>

        {/* Conversão de Previews */}
        <div className="bg-zinc-900/40 border border-white/5 hover:border-amber-500/30 hover:-translate-y-0.5 hover:shadow-2xl rounded-xl p-3 sm:p-4 relative overflow-hidden group transition-all duration-300 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-1">
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase leading-tight" style={{ marginLeft: '8px' }}>Conversão</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all">
              <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-2xl font-black text-white mb-2 sm:mb-3" style={{ marginLeft: '8px' }}>{totalSalesCount > 0 ? '14.8%' : '0%'}</h3>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-amber-500/10 border border-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-amber-400 uppercase tracking-wider">
              <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> <span className="truncate">Views ➔ Pag.</span>
            </div>
          </div>
        </div>

        {/* Alugueres e Compras */}
        <div className="bg-zinc-900/40 border border-white/5 hover:border-purple-500/30 hover:-translate-y-0.5 hover:shadow-2xl rounded-xl p-3 sm:p-4 relative overflow-hidden group transition-all duration-300 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-1">
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase leading-tight" style={{ marginLeft: '8px' }}>Assinantes VIP</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all">
              <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-2xl font-black text-white mb-2 sm:mb-3" style={{ marginLeft: '8px' }}>{activeSubscribers} <span className="text-[10px] sm:text-sm font-bold text-zinc-500">Ativos</span></h3>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-purple-500/10 border border-purple-500/20 px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-purple-400 uppercase tracking-wider">
              <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> <span className="truncate">Neste Período</span>
            </div>
          </div>
        </div>

      </div>

      {/* Seção de Gráficos e Figuras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Linha */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 lg:col-span-2 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-white font-bold text-xl tracking-tight">Evolução de Vendas</h2>
              <p className="text-xs text-zinc-400 font-medium mt-1">Faturamento M-Pesa / e-Mola ao longo do tempo</p>
            </div>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xflixRedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '1rem', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
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

        {/* Gráfico de Rosca */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-white font-bold text-xl tracking-tight">Métodos de Pagamento</h2>
              <p className="text-xs text-zinc-400 font-medium mt-1">M-Pesa vs e-Mola</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="h-[180px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white tracking-tighter">{totalSalesCount}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Vendas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shadow-[0_0_8px_#dc2626]" />
              <span className="text-zinc-400 font-medium">M-Pesa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]" />
              <span className="text-zinc-400 font-medium">e-Mola</span>
            </div>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 5 Vídeos */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-xl lg:col-span-1 flex flex-col">
          <div className="mb-4">
            <h2 className="text-white font-bold text-xl tracking-tight">Top Vídeos</h2>
            <p className="text-xs text-zinc-400 font-medium mt-1">Conteúdos mais clicados</p>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3 mt-2">
             {/* Mock Top 3 Vídeos */}
             {[
               { title: "Cena Exclusiva VIP Vol. 05", views: 1240 },
               { title: "Especial de Fim de Semana HD", views: 856 },
               { title: "Bastidores Inéditos (Parte 2)", views: 632 }
             ].map((vid, idx) => (
               <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                 <div className="w-8 h-8 shrink-0 rounded bg-red-500/10 text-red-500 font-black flex items-center justify-center text-xs border border-red-500/20 group-hover:scale-110 transition-transform">
                   #{idx + 1}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-red-400 transition-colors">{vid.title}</p>
                   <p className="text-[10px] text-zinc-500 flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {vid.views} acessos</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Tabela de Transações em Tempo Real */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-xl lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-white font-bold text-xl tracking-tight">Últimas Transações</h2>
              <p className="text-xs text-zinc-400 font-medium mt-1">Assinaturas VIP recentes</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-black/40 border border-white/10 hover:bg-black/60 text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Exportar CSV
              </button>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500 uppercase text-[10px] tracking-wider border-b border-white/5 font-bold">
                  <tr>
                    <th className="pb-3 px-2">Telefone</th>
                    <th className="pb-3 px-2">Plano</th>
                    <th className="pb-3 px-2">Método</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Valor Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-zinc-300">
                  {recentOrders.map((order) => {
                    const isMpesa = !order.payment_method?.toLowerCase().includes("emola");
                    const statusColor = order.status === "completed" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : order.status === "pending" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
                    return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-2 font-semibold text-white">{order.phone_number || order.user_id?.slice(0, 8) || "84***"}</td>
                      <td className="py-4 px-2 text-zinc-400">VIP 7 Dias</td>
                      <td className={`py-4 px-2 font-bold ${isMpesa ? "text-red-500" : "text-orange-500"}`}>
                        {isMpesa ? "M-Pesa" : "e-Mola"}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] border uppercase tracking-wider ${statusColor}`}>
                          {order.status === "completed" ? "Pago" : order.status === "pending" ? "Pendente" : "Pendente"}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right text-white font-bold">MT {order.amount || 25}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
          ) : (
            <div className="text-center py-16 space-y-3 border border-dashed border-white/10 rounded-2xl bg-black/20">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="w-6 h-6 text-zinc-500" />
              </div>
              <p className="text-base font-bold text-white">Nenhuma transação no período selecionado</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Assim que os clientes realizarem pagamentos, eles surgirão aqui.
              </p>
            </div>
          )}
        </div>
      </div>
      </div>

    </div>
  );
}
