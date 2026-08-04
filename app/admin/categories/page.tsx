import Link from "next/link";
import { Plus, Search, MoreVertical, Edit2, Trash2, Power, PowerOff } from "lucide-react";

// Mock Data
const MOCK_CATEGORIES = [
  { id: "1", name: "Premium Collection", slug: "premium-collection", status: "active", videos: 142, created_at: "2026-08-01" },
  { id: "2", name: "Vlogs Inéditos", slug: "vlogs", status: "active", videos: 89, created_at: "2026-08-01" },
  { id: "3", name: "Bastidores", slug: "bastidores", status: "inactive", videos: 56, created_at: "2026-08-02" },
];

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categorias</h1>
          <p className="text-zinc-500 mt-1">Gerencie as categorias e subcategorias da plataforma.</p>
        </div>
        
        <Link 
          href="/admin/categories/form" 
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar categoria..." 
            className="w-full bg-black border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-black/50 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
                <th className="p-4 w-full">Nome</th>
                <th className="p-4 whitespace-nowrap text-center">Status</th>
                <th className="p-4 whitespace-nowrap text-center">Vídeos</th>
                <th className="p-4 whitespace-nowrap">Data de Criação</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {MOCK_CATEGORIES.map(category => (
                <tr key={category.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-white mb-0.5">{category.name}</div>
                    <div className="text-xs text-zinc-500">/{category.slug}</div>
                  </td>
                  <td className="p-4 text-center">
                    {category.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center font-medium text-zinc-300">
                    {category.videos}
                  </td>
                  <td className="p-4 text-sm text-zinc-500 whitespace-nowrap">
                    {category.created_at}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg transition-colors" title={category.status === "active" ? "Desativar" : "Ativar"}>
                        {category.status === "active" ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4 text-emerald-500" />}
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-blue-400 bg-zinc-800 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-800 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
