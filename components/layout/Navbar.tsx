"use client";

// ============================================================
// XFLIX — Layout Component
// Navbar: fixed top navigation with mobile drawer
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Home, Grid3x3, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categorias", href: "/categorias", icon: Grid3x3 },
  { label: "Pesquisar", href: "/pesquisar", icon: Search },
];

// Future links (structure ready, not implemented):
// { label: "Biblioteca", href: "/biblioteca", icon: BookOpen },
// { label: "Perfil", href: "/perfil", icon: User },
// { label: "Admin", href: "/admin", icon: Shield },

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "transition-all duration-300",
          isScrolled
            ? "bg-[#09090B]/95 backdrop-blur-xl border-b border-[#27272A]/80 shadow-lg shadow-black/30"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16" aria-label="Navegação principal">

            {/* ── Logo ── */}
            <Link
              href="/"
              aria-label="Xflix - Página inicial"
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-white">
                  X
                </span>
                <span
                  className="text-2xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #DC2626, #EF4444)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  flix
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                      "transition-all duration-200",
                      isActive
                        ? "text-white bg-[#27272A]"
                        : "text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"
                    )}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop Auth Buttons ── */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" leftIcon={<LogIn size={15} />}>
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" leftIcon={<UserPlus size={15} />}>
                  Criar Conta
                </Button>
              </Link>
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileOpen}
              className={cn(
                "md:hidden flex items-center justify-center",
                "w-10 h-10 rounded-lg",
                "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]",
                "transition-colors duration-200"
              )}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </Container>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu de navegação mobile"
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-72",
          "bg-[#18181B] border-l border-[#27272A]",
          "flex flex-col pt-20 pb-8 px-4",
          "transition-transform duration-300 ease-out md:hidden",
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Nav Links */}
        <nav className="flex flex-col gap-1 mb-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-[#DC2626]/10 text-[#EF4444] border border-[#DC2626]/20"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-[#27272A] mb-6" />

        {/* Auth Buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button variant="secondary" size="md" fullWidth leftIcon={<LogIn size={16} />}>
              Entrar
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button variant="primary" size="md" fullWidth leftIcon={<UserPlus size={16} />}>
              Criar Conta
            </Button>
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-auto text-xs text-[#52525B] text-center">
          © 2025 Xflix. Todos os direitos reservados.
        </p>
      </div>
    </>
  );
}
