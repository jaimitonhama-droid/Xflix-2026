"use client";

import { useState } from "react";
import { Settings, Save, ShieldCheck, Key, Database, Cloud, Smartphone, Lock, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  // PaySuite Settings State
  const [paysuiteUrl, setPaysuiteUrl] = useState("https://api.paysuite.co.mz/v1");
  const [paysuiteKey, setPaysuiteKey] = useState("ps_live_************************");
  const [paysuiteSecret, setPaysuiteSecret] = useState("whsec_************************");

  // Supabase Settings State
  const [supabaseUrl, setSupabaseUrl] = useState("https://gvcliwdhgqpbrbvehpsa.supabase.co");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("sb_publishable_MyI_gUwwGtaw_qkRjbViMA_tsEBqmRO");

  // Cloudflare R2 Settings State
  const [r2AccountId, setR2AccountId] = useState("r2_account_****************");
  const [r2BucketName, setR2BucketName] = useState("xflix-videos-storage");
  const [r2PublicDomain, setR2PublicDomain] = useState("https://media.xflix.mz");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Configurações do Sistema</h1>
          <p className="text-sm text-zinc-400">Gerencie credenciais de APIs, gateways de pagamento e armazenamento do Xflix.</p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Configurações salvas com sucesso!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* 1. Gateway de Pagamento PaySuite (e-Mola / M-Pesa) */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">PaySuite (Pagamentos M-Pesa & e-Mola)</h2>
              <p className="text-xs text-zinc-400">Chaves de API para cobrança móvel em Moçambique.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">URL Base da API</label>
              <input 
                type="text"
                value={paysuiteUrl}
                onChange={(e) => setPaysuiteUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Chave API Secreta (API Key)</label>
              <input 
                type="password"
                value={paysuiteKey}
                onChange={(e) => setPaysuiteKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Segredo do Webhook (Webhook Secret)</label>
              <input 
                type="password"
                value={paysuiteSecret}
                onChange={(e) => setPaysuiteSecret(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Banco de Dados Supabase */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Supabase (Autenticação e Banco de Dados)</h2>
              <p className="text-xs text-zinc-400">Credenciais da instância Supabase.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Supabase Project URL</label>
              <input 
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Supabase Anon Key (Pública)</label>
              <input 
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Armazenamento Cloudflare R2 / AWS S3 */}
        <div className="bg-[#121215]/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Cloudflare R2 / S3 (Hospedagem de Vídeos)</h2>
              <p className="text-xs text-zinc-400">Bucket de armazenamento para arquivos MP4/HLS e thumbnails.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">ID da Conta Cloudflare (Account ID)</label>
              <input 
                type="text"
                value={r2AccountId}
                onChange={(e) => setR2AccountId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nome do Bucket</label>
              <input 
                type="text"
                value={r2BucketName}
                onChange={(e) => setR2BucketName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Domínio Público CDN / R2</label>
              <input 
                type="text"
                value={r2PublicDomain}
                onChange={(e) => setR2PublicDomain(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Botão de Guardar */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            <Save className="w-4 h-4" /> Salvar Configurações
          </button>
        </div>

      </form>

    </div>
  );
}
