import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import Link from "next/link";
import { Film, Menu } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/ui/SearchBar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { InstallPwaPrompt } from "@/components/ui/InstallPwaPrompt";

export const metadata: Metadata = {
  title: "Xflix",
  description: "A sua plataforma exclusiva de pacotes e conteúdos VIP.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Xflix",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#08080c",
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
            <InstallPwaPrompt />
          </AuthProvider>
        </QueryProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) { console.log('SW registered'); },
                    function(err) { console.log('SW failed', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

