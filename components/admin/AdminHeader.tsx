import { Calendar, Search, Bell, Command, ChevronDown, Shield } from "lucide-react";

export function AdminHeader() {
  const today = new Date().toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-end mb-6 pb-4 border-b border-zinc-800/60 gap-4">
      {/* Ferramentas (Data, Busca, Notificações, Perfil) */}
      <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto">
        
        {/* Data Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-[#121215] border border-zinc-800/80 px-3.5 py-2 rounded-xl text-zinc-300 text-xs font-medium shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-red-500" />
          <span>{today}</span>
        </div>

        {/* Busca com atalho Command-K */}
        <div className="relative flex-1 md:w-64 lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="w-full bg-[#121215] border border-zinc-800/80 text-white text-xs rounded-xl pl-10 pr-8 sm:pr-12 py-2.5 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-500 font-medium"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Separador */}
        <div className="h-7 w-[1px] bg-zinc-800 hidden sm:block"></div>

        {/* Notificações */}
        <button className="relative p-2.5 text-zinc-400 hover:text-white bg-[#121215] border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl transition-all shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-zinc-950 animate-pulse"></span>
        </button>

        {/* Perfil Admin */}
        <div className="flex items-center gap-3 bg-[#121215] border border-zinc-800/80 hover:border-zinc-700/80 px-3 py-1.5 rounded-xl cursor-pointer group transition-all shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors leading-none mb-0.5">Administrador</p>
            <p className="text-[10px] text-zinc-500 font-medium leading-none">Xflix Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors hidden sm:block ml-1" />
        </div>

      </div>
    </div>
  );
}
