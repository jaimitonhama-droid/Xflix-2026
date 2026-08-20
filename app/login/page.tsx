"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { login, register } from "@/app/auth/actions";
import { Loader2, Mail, Lock, User, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"register" | "login">("register");

  // Server Actions
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [registerState, registerAction, isRegisterPending] = useActionState(register, null);

  // Controlled states for inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Eye toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear fields on mode change to prevent Chrome autofill leakage
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [mode]);

  const isPasswordMismatch = mode === "register" && Boolean(password && confirmPassword && password !== confirmPassword);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#09090b] relative overflow-hidden select-none">
      
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-red-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
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

      {/* Main Form Card */}
      <div className="relative w-full max-w-[440px] z-10 my-16">
        <div className="bg-[#121215]/95 border border-zinc-800/90 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-[#18181b] border border-zinc-800 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Criar Conta
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Entrar
            </button>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
              {mode === "register" ? "Crie sua Conta Xflix" : "Bem-vindo de volta"}
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              {mode === "register"
                ? "Preencha os dados abaixo para ter acesso ilimitado"
                : "Entre com seus dados para continuar"}
            </p>
          </div>

          {/* ==================== FORMULÁRIO DE CADASTRO ==================== */}
          {mode === "register" && (
            <form action={registerAction} autoComplete="off" className="space-y-4 animate-fade-in">
              
              {/* Dummy hidden inputs to intercept Chrome password manager autofill */}
              <input
                type="text"
                name="chrome_autofill_trap_user"
                tabIndex={-1}
                autoComplete="username"
                className="opacity-0 absolute h-0 w-0 pointer-events-none -z-50"
              />
              <input
                type="password"
                name="chrome_autofill_trap_pass"
                tabIndex={-1}
                autoComplete="current-password"
                className="opacity-0 absolute h-0 w-0 pointer-events-none -z-50"
              />

              {registerState?.error && (
                <div
                  className={`rounded-2xl p-3.5 text-xs text-center font-semibold flex items-center justify-center gap-2 ${
                    registerState.error.includes("sucesso") || registerState.error.includes("criada")
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${registerState.error.includes("sucesso") || registerState.error.includes("criada") ? "text-emerald-400" : "text-red-500"}`} />
                  <span>{typeof registerState.error === "string" ? registerState.error : JSON.stringify(registerState.error)}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Campo NOME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-fullname">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      id="xflix-reg-fullname"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="off"
                      placeholder="Seu nome completo"
                      required
                      className="block w-full h-12 pl-5 pr-4 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Campo GMAIL / E-MAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-emailaddr">
                    Gmail / Endereço de E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="xflix-reg-emailaddr"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      placeholder="seu.email@gmail.com"
                      required
                      className="block w-full h-12 pl-5 pr-4 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Campo SENHA */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-newpass">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="xflix-reg-newpass"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="block w-full h-12 pl-5 pr-11 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-red-400" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Campo CONFIRMAR SENHA */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-reg-confpass">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="xflix-reg-confpass"
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
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-red-400" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {isPasswordMismatch && (
                    <p className="text-[11px] text-red-400 mt-1 ml-1 font-semibold">
                      As senhas não coincidem
                    </p>
                  )}
                </div>
              </div>

              {/* Termos de uso */}
              <div className="flex items-center pt-1.5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  defaultChecked
                  required
                  className="h-4 w-4 rounded border-zinc-800 bg-[#18181b] text-red-600 focus:ring-red-600 cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2.5 block text-xs text-zinc-400 font-medium cursor-pointer">
                  Aceito os{" "}
                  <Link href="#" className="text-red-500 hover:text-red-400 transition-colors">
                    Termos de Uso
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isRegisterPending || isPasswordMismatch}
                className="w-full flex justify-center items-center h-12 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-[0_0_30px_rgba(220,38,38,0.35)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-6 cursor-pointer"
              >
                {isRegisterPending ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Minha Conta"
                )}
              </button>
            </form>
          )}

          {/* ==================== FORMULÁRIO DE LOGIN ==================== */}
          {mode === "login" && (
            <form action={loginAction} autoComplete="off" className="space-y-4 animate-fade-in">
              
              {/* Dummy hidden inputs to intercept Chrome password manager autofill */}
              <input
                type="text"
                name="chrome_autofill_trap_user_login"
                tabIndex={-1}
                autoComplete="username"
                className="opacity-0 absolute h-0 w-0 pointer-events-none -z-50"
              />
              <input
                type="password"
                name="chrome_autofill_trap_pass_login"
                tabIndex={-1}
                autoComplete="current-password"
                className="opacity-0 absolute h-0 w-0 pointer-events-none -z-50"
              />

              {loginState?.error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3.5 text-xs text-red-400 text-center font-semibold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{typeof loginState.error === "string" ? loginState.error : JSON.stringify(loginState.error)}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Campo E-MAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 block ml-1" htmlFor="xflix-login-emailaddr">
                    Gmail / Endereço de E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="xflix-login-emailaddr"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      placeholder="seu.email@gmail.com"
                      required
                      className="block w-full h-12 pl-5 pr-4 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Campo SENHA */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-0.5">
                    <label className="text-xs font-semibold text-zinc-300" htmlFor="xflix-login-curpass">
                      Senha
                    </label>
                    <Link href="#" className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="xflix-login-curpass"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      className="block w-full h-12 pl-5 pr-11 border border-zinc-800/90 rounded-2xl bg-[#18181b]/90 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-red-400" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoginPending}
                className="w-full flex justify-center items-center h-12 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-[0_0_30px_rgba(220,38,38,0.35)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-6 cursor-pointer"
              >
                {isLoginPending ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Entrando...
                  </>
                ) : (
                  "Entrar na Conta"
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
