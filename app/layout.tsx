import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import Link from "next/link";
import { Film, Menu } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/ui/SearchBar";
import { TopNavbar } from "@/components/layout/TopNavbar";

export const metadata: Metadata = {
  title: "Xflix",
  description: "A sua plataforma premium de vídeos curtos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full dark antialiased">
      <body className="min-h-full flex flex-col bg-[#050505] text-[#fafafa] font-sans selection:bg-red-600/30">
        <QueryProvider>
          <AuthProvider>
            <TopNavbar />
            {/* Main Content - No padding top to allow Hero banner to stick to nav, or handled per page */}
            <main className="flex-1 w-full flex flex-col relative">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

