"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register } from "@/app/auth/actions";
import { Loader2, Mail, Lock, User, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordMismatch = Boolean(password && confirmPassword && password !== confirmPassword);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#09090b] relative overflow-hidden select-none">
      
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-red-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-3xl font-black tracking-tighter text-red-600 group-hover:scale-105 transition-transform">X</span>
          <span className="text-3xl font-black tracking-tighter text-white">FLIX</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 px-4 py-2 rounded-full transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-red-500" />
          Voltar ao Início
        </Link>
      </header>

      {/* Main Register Card */}
      <div className="relative w-full max-w-[440px] z-10 my-16">
        <div className="bg-[#121215]/95 border border-zinc-800/90 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Criar Conta</h1>
            <p className="text-xs text-zinc-400 font-medium">Cadastre-se para assistir aos vídeos exclusivos</p>
          </div>

          <form action={formAction} autoComplete="off" className="space-y-4">
            {/* Hidden dummy inputs to prevent browser autofill hijacking */}
            <input type="text" name="prevent_autofill" id="prevent_autofill_reg" value="" readOnly tabIndex={-1} className="hidden" aria-hidden="true" />
            <input type="password" name="prevent_autofill_pass" id="prevent_autofill_pass_reg" value="" readOnly tabIndex={-1} className="hidden" aria-hidden="true" />

            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3.5 text-xs text-red-400 text-center font-semibold animate-fade-in flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-name">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    id="xflix-reg-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Seu nome completo"
                    required
                    className="block w-full h-12 pl-5 pr-4 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-email">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <input
                    id="xflix-reg-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-password"
                    placeholder="seu.email@exemplo.com"
                    required
                    className="block w-full h-12 pl-5 pr-4 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-password">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="xflix-reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="block w-full h-12 pl-5 pr-11 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-confirmpass">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    id="xflix-reg-confirmpass"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    required
                    minLength={6}
                    className={`block w-full h-12 pl-5 pr-11 border rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none font-medium transition-all ${
                      isPasswordMismatch
                        ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
                        : "border-zinc-800/90 focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isPasswordMismatch && (
                  <p className="text-[11px] text-red-400 mt-1 ml-1 font-semibold">
                    As senhas não coincidem
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-zinc-800 bg-[#18181b] text-red-600 focus:ring-red-600 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2.5 block text-xs text-zinc-400 font-medium cursor-pointer">
                Eu aceito os{" "}
                <Link href="#" className="text-red-500 hover:text-red-400 transition-colors">
                  Termos de Uso
                </Link>
                {" "}e a{" "}
                <Link href="#" className="text-red-500 hover:text-red-400 transition-colors">
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending || isPasswordMismatch}
              className="w-full flex justify-center items-center h-12 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-[0_0_30px_rgba(220,38,38,0.35)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-6 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Criando conta...
                </>
              ) : (
                "Criar Minha Conta"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 text-center border-t border-zinc-800/80">
            <p className="text-xs text-zinc-400 font-medium">
              Já possui uma conta?{" "}
              <Link href="/login" className="font-bold text-red-500 hover:text-red-400 transition-colors">
                Faça login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
