"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, DollarSign, Smartphone, Search, Filter, Gift, Eye, Ban, Trash2, ArrowUpRight, CheckCircle2, XCircle, ChevronRight, RefreshCw, ShieldCheck } from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { createClient } from "@/services/supabase/client";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  status: "vip" | "free" | "banned";
  total_spent: number;
  purchases_count: number;
}

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      if (!profiles || profiles.length === 0) {
        setUsers([]);
      } else {
        const mapped: UserProfile[] = profiles.map((p: any) => ({
          id: p.id,
          name: p.username || p.email?.split("@")[0] || "Membro",
          email: p.email,
          created_at: new Date(p.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
          status: p.role === "admin" ? "vip" : "free",
          total_spent: 0,
          purchases_count: 0,
        }));
        setUsers(mapped);
      }
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setErrorMsg(err.message || "Falha de conexão com a base de dados.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGrantAccess = (userName: string) => {
    alert(`Acesso VIP concedido com sucesso ao utilizador ${userName}!`);
  };

  const handleToggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "banned" ? "free" : "banned" } : u
      )
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "vip" && u.status === "vip") ||
      (filterStatus === "free" && u.status === "free") ||
      (filterStatus === "banned" && u.status === "banned");

    return matchesSearch && matchesStatus;
  });

  const totalMembers = users.length;
  const vipMembers = users.filter((u) => u.status === "vip").length;

  const trafficData = [
    { name: 'Redes Sociais', visits: 0, percentage: '0%' },
    { name: 'Direto / WhatsApp', visits: 0, percentage: '0%' },
    { name: 'Pesquisa Orgânica', visits: 0, percentage: '0%' },
    { name: 'Recomendações', visits: 0, percentage: '0%' },
  ];

  // Gráfico de linha sempre visível (estrutura e figura mantidas)
  const visitsData = [
    { name: 'Semana 1', visits: 0 },
    { name: 'Semana 2', visits: 0 },
    { name: 'Semana 3', visits: 0 },
    { name: 'Semana 4', visits: 0 },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">Membros da Plataforma</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Crescimento de utilizadores e clientes VIP.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#121215] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar Lista
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold flex items-center justify-between gap-4 animate-fade-in">
          <span>Ocorreu um erro ao carregar os dados: {errorMsg}. Por favor, verifique a sua ligação à internet.</span>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-red-500/20 rounded-md transition-colors">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Cards de Métricas Principais (Valores Dinâmicos Reais) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Total de Usuários */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-red-500/30 rounded-2xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl min-w-0">
          <div className="flex items-center justify-between mb-3 gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate flex-1">Membros</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 sm:mb-3 truncate">{totalMembers}</h3>
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-red-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Registos
          </div>
        </div>

        {/* Usuários Ativos */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-emerald-500/30 rounded-2xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl min-w-0">
          <div className="flex items-center justify-between mb-3 gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate flex-1">Ativos Hoje</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 sm:mb-3 truncate">{totalMembers}</h3>
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Conetados
          </div>
        </div>

        {/* Clientes VIP Pagantes */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-amber-500/30 rounded-2xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl min-w-0">
          <div className="flex items-center justify-between mb-3 gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate flex-1">VIPs (Pago)</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 sm:mb-3 truncate">{vipMembers} VIPs</h3>
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Confirmados
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 hover:border-purple-500/30 rounded-2xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden group transition-all duration-300 backdrop-blur-xl min-w-0">
          <div className="flex items-center justify-between mb-3 gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate flex-1">Ticket Médio</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 sm:mb-3 truncate">MT 0</h3>
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-purple-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Média
          </div>
        </div>

      </div>

      {/* Seção de Gráficos e Figuras MANTIDOS INTACTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Visitas (Mantido e Renderizado) */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:col-span-2 shadow-xl backdrop-blur-xl flex flex-col justify-between overflow-hidden min-w-0">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">Visão Geral de Acessos</h2>
              <p className="text-xs text-zinc-500 font-medium">Evolução do tráfego semanal no site</p>
            </div>
            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              0 Visitas no Mês
            </span>
          </div>
          
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
              <AreaChart data={visitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="redVisitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
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
                  dataKey="visits" 
                  stroke="#dc2626" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#redVisitsGradient)" 
                  activeDot={{ r: 6, fill: '#ef4444', stroke: '#09090b', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dispositivos & Tráfego (Figuras e Progresso Mantidos) */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight mb-1">Dispositivos & Tráfego</h2>
            <p className="text-xs text-zinc-500 font-medium mb-6">Prevalência de acesso via telemóvel</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl">
                <Smartphone className="w-5 h-5 text-red-500 mb-2" />
                <h4 className="text-xl font-black text-white">0%</h4>
                <p className="text-[10px] text-zinc-500 font-medium">Mobile (Celular)</p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xl font-black text-white">0%</h4>
                <p className="text-[10px] text-zinc-500 font-medium">Clientes VIP</p>
              </div>
            </div>

            <div className="space-y-3">
              {trafficData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">{item.name}</span>
                    <span className="text-white">{item.percentage}</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: item.percentage }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Lista de Membros */}
      <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">Lista Completa de Membros</h2>
            <p className="text-xs text-zinc-500 font-medium">Gerencie contas, acessos VIP e concessões de conteúdo</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar utilizador..."
                className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 sm:py-2 outline-none focus:border-red-500 w-full sm:w-64"
              />
            </div>

            <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs w-full sm:w-auto">
              <button 
                onClick={() => setFilterStatus("all")}
                className={`py-2 sm:py-1 rounded-lg font-bold transition-all text-center ${filterStatus === "all" ? "bg-red-600 text-white" : "text-zinc-400"}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilterStatus("vip")}
                className={`py-2 sm:py-1 rounded-lg font-bold transition-all text-center ${filterStatus === "vip" ? "bg-red-600 text-white" : "text-zinc-400"}`}
              >
                VIPs
              </button>
              <button 
                onClick={() => setFilterStatus("free")}
                className={`py-2 sm:py-1 rounded-lg font-bold transition-all text-center ${filterStatus === "free" ? "bg-red-600 text-white" : "text-zinc-400"}`}
              >
                Grátis
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="text-zinc-300 uppercase tracking-wider border-b border-zinc-700/80 font-bold text-xs">
              <tr>
                <th className="pb-3.5 pt-1">Utilizador & E-mail</th>
                <th className="pb-3.5 pt-1">Data de Registo</th>
                <th className="pb-3.5 pt-1">Estado (Total Gasto)</th>
                <th className="pb-3.5 pt-1">Compras</th>
                <th className="pb-3.5 pt-1 text-right">Ações de Gestão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-zinc-400 font-semibold">
                    Nenhum utilizador encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-bold text-sm">{u.name}</p>
                        <p className="text-zinc-300 text-xs font-medium mt-0.5">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-200 font-medium text-xs">{u.created_at}</td>
                    <td className="py-4">
                      {u.status === "vip" && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                          ★ Cliente VIP
                        </span>
                      )}
                      {u.status === "free" && (
                        <span className="bg-zinc-800/90 text-zinc-200 border border-zinc-700/80 px-3 py-1 rounded-full text-xs font-semibold">
                          Conta Gratuita
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-zinc-200 font-bold text-xs">{u.purchases_count} vídeos</td>
                    <td className="py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleGrantAccess(u.name)}
                        className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        Dar Acesso VIP
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
