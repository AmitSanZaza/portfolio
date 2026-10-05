-- Portfolio Site — Supabase Storage setup for project images.
-- Run after supabase/schema.sql (it relies on public.is_site_owner()).
-- Creates the "project-images" bucket if missing: public read, owner-only
-- write, images only, 4 MB max per file.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  4194304,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Project images are publicly readable" on storage.objects;
create policy "Project images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "Only authenticated users can upload project images" on storage.objects;
drop policy if exists "Only the owner can upload project images" on storage.objects;
create policy "Only the owner can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and (select public.is_site_owner()));

drop policy if exists "Only authenticated users can update project images" on storage.objects;
drop policy if exists "Only the owner can update project images" on storage.objects;
create policy "Only the owner can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and (select public.is_site_owner()));

drop policy if exists "Only authenticated users can delete project images" on storage.objects;
drop policy if exists "Only the owner can delete project images" on storage.objects;
create policy "Only the owner can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and (select public.is_site_owner()));
