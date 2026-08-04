-- ============================================================
-- XFLIX — MASTER RESET & DATABASE SETUP SCRIPT
-- Copy and paste this script into the Supabase SQL Editor to reset
-- and build all database tables, triggers, and policies from scratch.
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 0. CLEAN RESET PUBLIC SCHEMA & GRANT PERMISSIONS
-- ──────────────────────────────────────────────────────────
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;

-- ──────────────────────────────────────────────────────────
-- 1. PROFILES TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  email       TEXT NOT NULL,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);

-- ──────────────────────────────────────────────────────────
-- 2. UPDATED_AT TRIGGER FUNCTION
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 3. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────
-- 4. CATEGORIES TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  parent_id   UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX categories_parent_id_idx ON public.categories(parent_id);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 5. VIDEOS TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.videos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  preview_url   TEXT,
  video_url     TEXT,
  price         NUMERIC(10, 2) DEFAULT 0,
  rental_price  NUMERIC(10, 2) DEFAULT 0,
  duration      INTEGER,
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX videos_category_id_idx ON public.videos(category_id);
CREATE INDEX videos_status_idx ON public.videos(status);

CREATE TRIGGER videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 6. ORDERS TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id          UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  purchase_type     TEXT NOT NULL CHECK (purchase_type IN ('buy', 'rent')),
  payment_status    TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  amount            NUMERIC(10, 2) NOT NULL,
  payment_reference TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_video_id_idx ON public.orders(video_id);

-- ──────────────────────────────────────────────────────────
-- 7. LIBRARY TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.library (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id     UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('buy', 'rent')),
  expires_at   TIMESTAMPTZ,
  can_download BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, video_id)
);

CREATE INDEX library_user_id_idx ON public.library(user_id);

-- ──────────────────────────────────────────────────────────
-- 8. FAVORITES TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id   UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  UNIQUE(user_id, video_id)
);

CREATE INDEX favorites_user_id_idx ON public.favorites(user_id);

-- ──────────────────────────────────────────────────────────
-- 9. SETTINGS TABLE
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.settings (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key   TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL
);

-- ──────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ──────────────────────────────────────────────────────────

-- PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role and trigger can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- CATEGORIES RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- VIDEOS RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage videos" ON public.videos USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ORDERS RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- LIBRARY RLS
ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own library" ON public.library FOR SELECT USING (auth.uid() = user_id);

-- FAVORITES RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON public.favorites USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SETTINGS RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);

-- ──────────────────────────────────────────────────────────
-- 11. INITIAL SEED DATA (CATEGORIES)
-- ──────────────────────────────────────────────────────────
INSERT INTO public.categories (name, slug, description, status) VALUES
  ('Lançamentos VIP', 'lancamentos-vip', 'Vídeos recém-lançados com qualidade HD', 'active'),
  ('Exclusivos Xflix', 'exclusivos-xflix', 'Conteúdos exclusivos da nossa plataforma', 'active'),
  ('Cenas Completas', 'cenas-completas', 'Vídeos completos com reprodução ilimitada', 'active'),
  ('Mais Vistos', 'mais-vistos', 'Os conteúdos mais populares da semana', 'active')
ON CONFLICT DO NOTHING;-- ──────────────────────────────────────────────────────────
-- 12. GRANT TABLE PRIVILEGES
-- ──────────────────────────────────────────────────────────
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
