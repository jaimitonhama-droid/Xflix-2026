import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Supabase Storage (futuro)
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com", // Cloudflare R2 (futuro)
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  devIndicators: false,
};

export default nextConfig;
