-- Portfolio Site — Supabase Storage setup for project images.
-- Run after creating the "project-images" bucket (Dashboard > Storage > New bucket,
-- name it exactly "project-images", and leave it private — these policies grant
-- public read explicitly instead).

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Project images are publicly readable" on storage.objects;
create policy "Project images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "Only authenticated users can upload project images" on storage.objects;
create policy "Only authenticated users can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Only authenticated users can update project images" on storage.objects;
create policy "Only authenticated users can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Only authenticated users can delete project images" on storage.objects;
create policy "Only authenticated users can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
