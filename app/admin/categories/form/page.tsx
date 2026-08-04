"use client";

import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";

export default function AdminCategoryFormPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 w-full py-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/categories" 
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nova Categoria</h1>
          <p className="text-zinc-500 mt-1">Crie uma nova categoria ou subcategoria.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <form className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Nome da Categoria</label>
              <input 
                type="text" 
                placeholder="Ex: Premium Collection"
                className="w-full bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Slug (URL)</label>
              <input 
                type="text" 
                placeholder="Ex: premium-collection"
                className="w-full bg-black border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-xs text-zinc-500 ml-1">O slug deve conter apenas letras minúsculas e hifens.</p>
            </div>
          </div>

          {/* Categoria Pai */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Categoria Pai (Opcional)</label>
            <select className="w-full bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors appearance-none">
              <option value="">Nenhuma (Categoria Principal)</option>
              <option value="1">Premium Collection</option>
              <option value="2">Vlogs</option>
            </select>
            <p className="text-xs text-zinc-500 ml-1">Selecione uma categoria para transformar esta em uma subcategoria.</p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Descrição</label>
            <textarea 
              rows={4}
              placeholder="Descreva sobre o que é esta categoria..."
              className="w-full bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          {/* Imagem de Capa */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Imagem de Capa (URL)</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="https://..."
                className="flex-1 bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button type="button" className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-4 py-3 rounded-xl transition-colors whitespace-nowrap">
                <ImageIcon className="w-4 h-4" />
                Upload (R2)
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="status"
                defaultChecked
                className="w-5 h-5 rounded border-zinc-800 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-zinc-900"
              />
              <label htmlFor="status" className="text-sm font-medium text-white cursor-pointer">
                Categoria Ativa
              </label>
            </div>
            <p className="text-xs text-zinc-500 ml-8">Desative para ocultar temporariamente esta categoria dos usuários.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
            <Link 
              href="/admin/categories"
              className="px-6 py-3 text-zinc-400 hover:text-white font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button 
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-red-600/20"
            >
              <Save className="w-5 h-5" />
              Salvar Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
