create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  display_name text not null default 'Member',
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  vn_title text not null,
  icon text not null default '🌍',
  color text not null default '#0f766e',
  description text not null default '',
  phrases jsonb not null default '[]'::jsonb,
  vocab jsonb not null default '[]'::jsonb,
  tips jsonb not null default '[]'::jsonb,
  dialogue jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medical_sections (
  id uuid primary key default gen_random_uuid(),
  section_type text not null,
  slug text unique not null,
  title text not null,
  subtitle text not null default '',
  phrases jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.procedures (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  vn_title text not null,
  icon text not null default '🔬',
  steps jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drill_items (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique not null,
  category text not null default 'general',
  english text not null,
  vietnamese text not null,
  note text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  icon text not null default '🎭',
  level text not null default 'beginner',
  description text not null default '',
  hint text not null default '',
  system_prompt text not null default '',
  opening_line text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listening_lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  source text not null default '',
  level text not null default 'beginner',
  duration text not null default '2 min',
  transcript jsonb not null default '[]'::jsonb,
  connected_speech jsonb not null default '[]'::jsonb,
  vocab jsonb not null default '[]'::jsonb,
  quiz jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists daily_topics_touch_updated_at on public.daily_topics;
create trigger daily_topics_touch_updated_at
before update on public.daily_topics
for each row
execute function public.touch_updated_at();

drop trigger if exists medical_sections_touch_updated_at on public.medical_sections;
create trigger medical_sections_touch_updated_at
before update on public.medical_sections
for each row
execute function public.touch_updated_at();

drop trigger if exists procedures_touch_updated_at on public.procedures;
create trigger procedures_touch_updated_at
before update on public.procedures
for each row
execute function public.touch_updated_at();

drop trigger if exists drill_items_touch_updated_at on public.drill_items;
create trigger drill_items_touch_updated_at
before update on public.drill_items
for each row
execute function public.touch_updated_at();

drop trigger if exists scenarios_touch_updated_at on public.scenarios;
create trigger scenarios_touch_updated_at
before update on public.scenarios
for each row
execute function public.touch_updated_at();

drop trigger if exists listening_lessons_touch_updated_at on public.listening_lessons;
create trigger listening_lessons_touch_updated_at
before update on public.listening_lessons
for each row
execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.daily_topics enable row level security;
alter table public.medical_sections enable row level security;
alter table public.procedures enable row level security;
alter table public.drill_items enable row level security;
alter table public.scenarios enable row level security;
alter table public.listening_lessons enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "daily_topics_public_read" on public.daily_topics;
create policy "daily_topics_public_read"
on public.daily_topics
for select
to anon, authenticated
using (published = true);

drop policy if exists "medical_sections_public_read" on public.medical_sections;
create policy "medical_sections_public_read"
on public.medical_sections
for select
to anon, authenticated
using (published = true);

drop policy if exists "procedures_public_read" on public.procedures;
create policy "procedures_public_read"
on public.procedures
for select
to anon, authenticated
using (published = true);

drop policy if exists "drill_items_public_read" on public.drill_items;
create policy "drill_items_public_read"
on public.drill_items
for select
to anon, authenticated
using (published = true);

drop policy if exists "scenarios_public_read" on public.scenarios;
create policy "scenarios_public_read"
on public.scenarios
for select
to anon, authenticated
using (published = true);

drop policy if exists "listening_lessons_public_read" on public.listening_lessons;
create policy "listening_lessons_public_read"
on public.listening_lessons
for select
to anon, authenticated
using (published = true);

