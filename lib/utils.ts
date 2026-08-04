// ============================================================
// XFLIX — Lib
// utils: general library utilities
// ============================================================

/**
 * Re-exports cn from utils for convenient import from lib
 */
export { cn } from "@/utils/cn";

/**
 * Environment detection
 */
export const isBrowser = typeof window !== "undefined";
export const isServer = !isBrowser;

/**
 * App constants
 */
export const APP_NAME = "Xflix";
export const APP_DESCRIPTION =
  "A plataforma premium de conteúdo digital em português.";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Navigation links
 * Structured to support future menu items (Biblioteca, Perfil, Admin)
 */
export const NAV_LINKS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Categorias", href: "/categorias", icon: "Grid3x3" },
  { label: "Pesquisar", href: "/pesquisar", icon: "Search" },
] as const;

export const NAV_AUTH_LINKS = [
  { label: "Entrar", href: "/entrar", variant: "ghost" as const },
  { label: "Criar Conta", href: "/criar-conta", variant: "primary" as const },
] as const;

// Future menu items (not yet implemented)
export const NAV_USER_LINKS = [
  { label: "Biblioteca", href: "/biblioteca", icon: "BookOpen" },
  { label: "Perfil", href: "/perfil", icon: "User" },
] as const;

export const NAV_ADMIN_LINKS = [
  { label: "Admin", href: "/admin", icon: "Shield" },
] as const;
