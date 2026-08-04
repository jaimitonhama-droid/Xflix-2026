// ============================================================
// XFLIX — TypeScript Types
// Video Types
// ============================================================

export type VideoCategory =
  | "Tecnologia"
  | "Design"
  | "Negócios"
  | "Marketing"
  | "Programação"
  | "Finanças"
  | "Saúde"
  | "Arte"
  | "Música"
  | "Educação";

export type VideoStatus = "published" | "draft" | "processing" | "private";

export type VideoPricing = "free" | "paid" | "premium";

export interface VideoThumbnail {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface VideoAuthor {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: VideoThumbnail;
  author: VideoAuthor;
  category: VideoCategory;
  tags: string[];
  duration: number; // in seconds
  views: number;
  likes: number;
  rating: number; // 0-5
  price: number; // 0 = free
  pricing: VideoPricing;
  status: VideoStatus;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  // Future: will be linked to Cloudflare R2
  videoUrl?: string;
  // Future: will be linked to Supabase
  supabaseId?: string;
}

export interface VideoCardProps {
  video: Video;
  variant?: "default" | "featured" | "compact";
  showAuthor?: boolean;
  showRating?: boolean;
  className?: string;
}

export interface VideoRowProps {
  title: string;
  videos: Video[];
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
}
