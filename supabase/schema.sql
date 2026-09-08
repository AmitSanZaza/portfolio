-- Portfolio Site — Supabase schema
-- Run this once in the Supabase project's SQL Editor (Dashboard > SQL Editor > New query).
-- See specs/001-portfolio-site/data-model.md for the field-by-field rationale.

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  technologies text[] not null default '{}',
  demo_url text,
  source_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit (FR-007).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- Row Level Security (FR-011 / SC-005): anyone can read, only an authenticated
-- (the single owner) user can write.
alter table public.projects enable row level security;

drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Projects are publicly readable"
  on public.projects for select
  using (true);

drop policy if exists "Only authenticated users can insert projects" on public.projects;
create policy "Only authenticated users can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "Only authenticated users can update projects" on public.projects;
create policy "Only authenticated users can update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Only authenticated users can delete projects" on public.projects;
create policy "Only authenticated users can delete projects"
  on public.projects for delete
  to authenticated
  using (true);
