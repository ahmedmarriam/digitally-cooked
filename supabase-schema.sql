-- ============================================================
-- DIGITALLY COOKED — Supabase Schema
-- Run this in: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. USERS TABLE
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  plan text not null default 'starter', -- starter | growth | agency
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. BRANDS TABLE
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  -- Step 1 — Brand Strategy
  brand_personality text,
  tone_of_voice text,
  target_audience text,
  audience_pain_points text,
  audience_goals text,
  positioning_statement text,
  brand_colors text,
  brand_mission text,
  -- Step 2 — Content Details
  brand_name text,
  owner_name text,
  business_type text,
  location text,
  business_description text,
  top_products text,
  unique_factor text,
  ideal_customer text,
  content_tone text,
  visual_style text,
  monthly_goal text,
  posting_frequency text,
  platforms text[], -- array: ['instagram', 'tiktok', 'facebook', 'linkedin', 'youtube']
  logo_url text,
  -- Meta
  generation_status text default 'pending', -- pending | generating | complete | failed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. POSTS TABLE
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  post_number integer,           -- 1–40
  day integer,                   -- 1–30 or null for BONUS posts
  is_bonus boolean default false,
  platform text,                 -- instagram | tiktok | facebook | linkedin | youtube
  format text,                   -- Reel | Carousel | Static Post | Story | Video
  pillar text,
  hook text,
  caption text,
  cta text,
  hashtags text,
  image_prompt text,
  image_url text,                -- Ideogram-generated image URL
  custom_image_url text,         -- user-uploaded replacement image
  status text default 'draft',   -- draft | scheduled | posted
  scheduled_at timestamptz,
  zernio_post_id text,
  -- Editor state (for image editor)
  editor_data jsonb,             -- stores Fabric.js canvas JSON
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_brands_user_id on public.brands(user_id);
create index if not exists idx_posts_brand_id on public.posts(brand_id);
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_platform on public.posts(platform);
create index if not exists idx_posts_status on public.posts(status);

-- ============================================================
-- ROW LEVEL SECURITY — disabled for MVP, enable when ready
-- ============================================================
alter table public.users disable row level security;
alter table public.brands disable row level security;
alter table public.posts disable row level security;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function public.handle_updated_at();

create trigger brands_updated_at before update on public.brands
  for each row execute function public.handle_updated_at();

create trigger posts_updated_at before update on public.posts
  for each row execute function public.handle_updated_at();
