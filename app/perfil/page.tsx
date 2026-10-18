"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/providers/AuthProvider";
import { updateProfile } from "@/services/supabase/profile";
import { getUserOrders } from "@/services/supabase/orders";
import { createClient } from "@/services/supabase/client";
import type { Order } from "@/types/index";
import {
  User, Crown, CreditCard, Shield, LogOut, Check,
  AlertCircle, Loader2, Lock, Zap, Star,
  Eye, EyeOff, Save, Edit3, Calendar,
} from "lucide-react";
import Link from "next/link";

// ─── Helpers ───────────────────────────────────
function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}
function isVipActive(profile: any) {
  if (profile?.subscription_status !== "active") return false;
  if (!profile?.subscription_expires_at) return false;
  return new Date(profile.subscription_expires_at) > new Date();
}
function daysLeft(expiresAt: string | null | undefined) {
  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000));
}

type Tab = "conta" | "vip" | "pagamentos" | "seguranca";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "conta",      label: "Conta",    icon: <User className="w-[22px] h-[22px]" /> },
  { id: "vip",        label: "VIP",      icon: <Crown className="w-[22px] h-[22px]" /> },
  { id: "pagamentos", label: "Pagament.", icon: <CreditCard className="w-[22px] h-[22px]" /> },
  { id: "seguranca",  label: "Segurança",icon: <Shield className="w-[22px] h-[22px]" /> },
];

// ─── Main Page ──────────────────────────────────
export default function PerfilPage() {
  const { user, profile, isLoading, isAuthenticated, refreshProfile } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("conta");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
      </div>
    );
  }
  if (!user || !profile) return null;

  const vipActive = isVipActive(profile);
  const vipDays   = daysLeft(profile.subscription_expires_at);
  const initials  = (profile.email || "U").split("@")[0].slice(0, 2).toUpperCase();
  const name      = profile.username || profile.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/4 rounded-full blur-[100px]" />
      </div>

      {/* ═══════════════ DESKTOP ═══════════════ */}
      <div className="hidden lg:flex max-w-4xl mx-auto px-6 py-12 gap-8">

        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 space-y-6">
          {/* Avatar + info */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black ${
              vipActive ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black" : "bg-zinc-800 text-white"
            }`}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                : initials}
            </div>
            <div className="w-full overflow-hidden">
              <p className="text-white font-bold text-sm truncate">{name}</p>
              <p className="text-zinc-500 text-xs truncate">{profile.email}</p>
            </div>
            {vipActive
              ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">
                  <Crown className="w-2.5 h-2.5 fill-yellow-400" /> VIP ATIVO
                </span>
              : <Link href="/" className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-yellow-400 transition-colors px-2.5 py-1 rounded-full border border-zinc-800 hover:border-yellow-500/20">
                  <Crown className="w-2.5 h-2.5" /> Assinar VIP
                </Link>
            }
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.id ? "bg-zinc-800/80 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span className={activeTab === tab.id ? "text-red-500" : "text-zinc-600"}>{tab.icon}</span>
                {tab.label === "Pagament." ? "Pagamentos" : tab.label}
              </button>
            ))}
            <button onClick={async () => { const supabase = createClient(); await supabase.auth.signOut(); await fetch("/api/auth/session", { method: "DELETE" }); router.push("/login"); }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all mt-4"
            >
              <LogOut className="w-[22px] h-[22px]" /> Sair
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <TabContent activeTab={activeTab} profile={profile} user={user} vipActive={vipActive} vipDays={vipDays} refreshProfile={refreshProfile} router={router} />
        </main>
      </div>

      {/* ═══════════════ MOBILE ═══════════════ */}
      <div className="lg:hidden flex flex-col" style={{ paddingBottom: 80 }}>

        {/* Mobile Header */}
        <div className="px-5 pt-8 pb-5 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-black flex-shrink-0 ${
              vipActive ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black" : "bg-zinc-800 text-white"
            }`}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                : initials}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-white font-bold text-sm truncate">{name}</p>
              <p className="text-zinc-500 text-xs truncate">{profile.email}</p>
              {vipActive
                ? <p className="text-yellow-400 text-[10px] font-bold mt-0.5 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 fill-yellow-400" /> VIP · {vipDays}d restantes
                  </p>
                : <p className="text-zinc-600 text-[10px] mt-0.5">Conta gratuita</p>
              }
            </div>
          </div>
        </div>

        {/* Mobile Content area */}
        <div className="px-5 pt-6">
          <TabContent activeTab={activeTab} profile={profile} user={user} vipActive={vipActive} vipDays={vipDays} refreshProfile={refreshProfile} router={router} />
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/80 bg-zinc-950/98 backdrop-blur-xl">
        <div className="flex items-stretch h-[64px]">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${
                  active ? "text-white" : "text-zinc-600"
                }`}
              >
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-b-full" />}
                <span className={active ? "text-red-500" : ""}>{tab.icon}</span>
                <span className="text-[9px] font-semibold tracking-wide leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}

// ─── Shared TabContent router ─────────────────────────
function TabContent({ activeTab, profile, user, vipActive, vipDays, refreshProfile, router }: any) {
  return (
    <>
      {activeTab === "conta"      && <ContaTab      profile={profile} user={user} refreshProfile={refreshProfile} />}
      {activeTab === "vip"        && <VipTab        profile={profile} vipActive={vipActive} vipDays={vipDays} />}
      {activeTab === "pagamentos" && <PagamentosTab userId={user.id} />}
      {activeTab === "seguranca"  && <SegurancaTab  user={user} router={router} />}
    </>
  );
}

// ─── Tiny helpers ──────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">{children}</p>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="py-5 border-b border-zinc-800/50 last:border-0">{children}</div>;
}

function InputField({
  value, onChange, placeholder, type = "text", icon, readOnly, rightSlot,
}: {
  value: string; onChange?: (v: string) => void; placeholder?: string;
  type?: string; icon?: React.ReactNode; readOnly?: boolean; rightSlot?: React.ReactNode;
}) {
  return (
    <div className="relative mt-1">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full h-12 ${icon ? "pl-10" : "pl-4"} pr-4 rounded-xl border text-sm font-medium outline-none transition-colors ${
          readOnly
            ? "bg-zinc-900/30 border-zinc-800/50 text-zinc-500 cursor-default"
            : "bg-zinc-900/60 border-zinc-800 text-white focus:border-zinc-600 placeholder-zinc-700"
        }`}
      />
      {rightSlot && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>}
    </div>
  );
}

// ─── Tab: Conta ──────────────────────────────────────
function ContaTab({ profile, user, refreshProfile }: any) {
  const [username, setUsername] = useState(profile.username || "");
  const [isSaving, setIsSaving] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); setError(""); setSuccess(false);
    const { error: err } = await updateProfile(user.id, { username });
    if (err) { setError("Erro ao guardar. Tente novamente."); }
    else { setSuccess(true); await refreshProfile(); setTimeout(() => setSuccess(false), 3000); }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave}>
      <Row>
        <Label>Nome de utilizador</Label>
        <InputField
          value={username}
          onChange={setUsername}
          placeholder="O seu nome"
          icon={<Edit3 className="w-4 h-4" />}
        />
      </Row>

      <Row>
        <Label>E-mail</Label>
        <div className="flex items-center justify-between mt-1 gap-4">
          <p className="text-sm text-zinc-400 font-medium truncate flex-1">{profile.email}</p>
          <span className="text-[10px] font-bold text-emerald-500 whitespace-nowrap flex-shrink-0">✓ Verificado</span>
        </div>
      </Row>

      <Row>
        <Label>Membro desde</Label>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4 text-zinc-600 flex-shrink-0" />
          <span className="text-sm text-zinc-400">{new Date(profile.created_at).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
      </Row>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3 mt-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="pt-6">
        <button type="submit" disabled={isSaving}
          className="flex items-center gap-2 bg-white text-zinc-950 font-bold text-sm h-11 px-6 rounded-xl hover:bg-zinc-100 disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
          {success ? "Guardado!" : "Guardar Alterações"}
        </button>
      </div>
    </form>
  );
}

// ─── Tab: VIP ─────────────────────────────────────────
function VipTab({ profile, vipActive, vipDays }: any) {
  const benefits = [
    { icon: <Zap className="w-4 h-4" />,   label: "Acesso ilimitado a todos os vídeos" },
    { icon: <Star className="w-4 h-4" />,   label: "Conteúdo exclusivo para membros VIP" },
    { icon: <Shield className="w-4 h-4" />, label: "Sem anúncios ou interrupções" },
    { icon: <Crown className="w-4 h-4" />,  label: "Suporte prioritário" },
  ];

  return (
    <div>
      {/* Status */}
      {vipActive ? (
        <div className="flex items-center gap-4 p-5 mb-6 rounded-2xl bg-yellow-500/8 border border-yellow-500/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-black fill-black" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-yellow-400 font-black text-base">VIP Ativo</p>
            <p className="text-zinc-500 text-xs truncate">
              Expira em <span className={`font-bold ${vipDays <= 2 ? "text-red-400" : "text-zinc-300"}`}>{vipDays} dias</span>
              {" · "}{formatDate(profile.subscription_expires_at)}
            </p>
          </div>
          <Link href="/" className="flex-shrink-0 text-[11px] font-bold text-black bg-yellow-500 hover:bg-yellow-400 transition-colors px-3 py-1.5 rounded-lg">
            Renovar
          </Link>
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-zinc-700" />
          </div>
          <p className="text-white font-black text-lg mb-1">Sem Assinatura VIP</p>
          <p className="text-zinc-500 text-sm mb-5">
            Aceda a todo o conteúdo por <span className="text-white font-bold">25 MT</span> durante 7 dias.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-sm h-12 px-7 rounded-xl hover:opacity-90 transition-all"
          >
            <Crown className="w-4 h-4 fill-black" /> Assinar VIP — 25 MT
          </Link>
        </div>
      )}

      {/* Benefits */}
      <Label>Benefícios incluídos</Label>
      {benefits.map((b, i) => (
        <div key={i} className="flex items-center gap-4 py-4 border-b border-zinc-800/40 last:border-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            vipActive ? "bg-yellow-500/15 text-yellow-400" : "bg-zinc-900 text-zinc-700"
          }`}>
            {b.icon}
          </div>
          <span className={`text-sm ${vipActive ? "text-zinc-300" : "text-zinc-600"}`}>{b.label}</span>
          {vipActive && <Check className="w-4 h-4 text-yellow-400 ml-auto flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Pagamentos ──────────────────────────────────
function PagamentosTab({ userId }: { userId: string }) {
  const [orders,   setOrders]  = useState<Order[]>([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    getUserOrders(userId).then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, [userId]);

  const badge: Record<string, { label: string; cls: string }> = {
    completed: { label: "Confirmado", cls: "text-emerald-400 bg-emerald-500/10" },
    pending:   { label: "Pendente",   cls: "text-yellow-400 bg-yellow-500/10" },
    failed:    { label: "Falhado",    cls: "text-red-400 bg-red-500/10" },
    refunded:  { label: "Reembolsado",cls: "text-zinc-400 bg-zinc-800" },
  };
  const typeLabel: Record<string, string> = { vip: "Assinatura VIP", buy: "Compra de Vídeo", rent: "Aluguer de Vídeo" };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CreditCard className="w-10 h-10 text-zinc-800 mb-3" />
      <p className="text-zinc-500 text-sm font-medium">Nenhum pagamento ainda</p>
      <p className="text-zinc-700 text-xs mt-1">As suas transações aparecerão aqui</p>
    </div>
  );

  return (
    <div>
      <Label>{orders.length} registo{orders.length !== 1 ? "s" : ""}</Label>
      {orders.map((o) => {
        const s = badge[o.payment_status] || badge.pending;
        return (
          <div key={o.id} className="flex items-center gap-4 py-4 border-b border-zinc-800/40 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{typeLabel[o.purchase_type] || o.purchase_type}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{formatDate(o.created_at)}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span className="text-white font-bold text-sm">{(o.amount ?? 0).toFixed(2)} MT</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Segurança ───────────────────────────────────
function SegurancaTab({ user, router }: any) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCur,   setShowCur]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (newPw !== confirmPw) { setError("As senhas não coincidem."); return; }
    if (newPw.length < 6)    { setError("Mínimo 6 caracteres."); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPw
      });
      if (signInError) throw new Error("wrong-password");
      
      const { error: updateError } = await supabase.auth.updateUser({ password: newPw });
      if (updateError) throw new Error("update-error");
      
      setSuccess(true); setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message.includes("wrong-password") ? "Senha atual incorreta." : "Erro ao alterar.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSave}>
      <Row>
        <Label>Senha atual</Label>
        <div className="relative mt-1">
          <input
            type={showCur ? "text" : "password"}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            required
            className="w-full h-12 pl-4 pr-12 rounded-xl border border-zinc-800 bg-zinc-900/60 text-white text-sm font-medium outline-none focus:border-zinc-600 transition-colors"
          />
          <button type="button" onClick={() => setShowCur(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
            {showCur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Row>

      <Row>
        <Label>Nova senha</Label>
        <div className="relative mt-1">
          <input
            type={showNew ? "text" : "password"}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required minLength={6}
            className="w-full h-12 pl-4 pr-12 rounded-xl border border-zinc-800 bg-zinc-900/60 text-white text-sm font-medium outline-none focus:border-zinc-600 transition-colors"
          />
          <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Row>

      <Row>
        <Label>Confirmar nova senha</Label>
        <div className="relative mt-1">
          <input
            type={showNew ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required minLength={6}
            className={`w-full h-12 pl-4 pr-4 rounded-xl border bg-zinc-900/60 text-white text-sm font-medium outline-none transition-colors ${
              confirmPw && newPw !== confirmPw ? "border-red-500/50" : "border-zinc-800 focus:border-zinc-600"
            }`}
          />
        </div>
        {confirmPw && newPw !== confirmPw && (
          <p className="text-red-400 text-xs mt-2">As senhas não coincidem</p>
        )}
      </Row>

      {error   && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3 mt-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
      {success && <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3 mt-2"><Check className="w-4 h-4 flex-shrink-0" />Senha alterada com sucesso!</div>}

      <div className="pt-6">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-white text-zinc-950 font-bold text-sm h-11 px-6 rounded-xl hover:bg-zinc-100 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          Alterar Senha
        </button>
      </div>

      {/* Danger zone */}
      <div className="mt-10 pt-6 border-t border-zinc-800/50">
        <Label>Sessão</Label>
        <div className="flex items-start justify-between gap-4 mt-3">
          <div className="min-w-0">
            <p className="text-sm text-white font-semibold mb-1">Terminar todas as sessões</p>
            <p className="text-xs text-zinc-600 leading-relaxed">Encerra o acesso em todos os dispositivos.</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Terminar sessão em todos os dispositivos?")) return;
              const supabase = createClient();
              await supabase.auth.signOut();
              await fetch("/api/auth/session", { method: "DELETE" });
              router.push("/login");
            }}
            className="flex-shrink-0 flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-semibold transition-colors py-2"
          >
            <LogOut className="w-4 h-4" /> Terminar
          </button>
        </div>
      </div>
    </form>
  );
}
