// ============================================================
// XFLIX — Supabase Database Types
// ============================================================

export type UserRole = "user" | "creator" | "admin";

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  status?: "active" | "inactive";
  parent_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  preview_url: string | null;
  video_url: string | null;
  price: number;
  rental_price: number;
  duration: number | null;
  status: "draft" | "published" | "archived";
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  video_id: string;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  video_id: string;
  purchase_type: "buy" | "rent";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  amount: number;
  payment_reference: string | null;
  created_at: string;
}

export interface LibraryItem {
  id: string;
  user_id: string;
  video_id: string;
  purchase_type: "buy" | "rent";
  expires_at: string | null;
  can_download: boolean;
}

export type Database = any;
