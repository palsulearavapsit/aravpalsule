-- Public visitors can read the single content document. Only the portfolio owner
-- can change it. Create the owner account manually in Supabase Auth; do not enable
-- public sign-ups for this project.
create table if not exists public.portfolio_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update on public.portfolio_content to authenticated;

drop policy if exists "Portfolio content is publicly readable" on public.portfolio_content;
create policy "Portfolio content is publicly readable"
  on public.portfolio_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Portfolio owner can insert content" on public.portfolio_content;
create policy "Portfolio owner can insert content"
  on public.portfolio_content for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'palsulearav934@gmail.com');

drop policy if exists "Portfolio owner can update content" on public.portfolio_content;
create policy "Portfolio owner can update content"
  on public.portfolio_content for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'palsulearav934@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'palsulearav934@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio certificate images are publicly readable" on storage.objects;
create policy "Portfolio certificate images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Portfolio owner can upload certificate images" on storage.objects;
create policy "Portfolio owner can upload certificate images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (auth.jwt() ->> 'email') = 'palsulearav934@gmail.com'
  );

drop policy if exists "Portfolio owner can update certificate images" on storage.objects;
create policy "Portfolio owner can update certificate images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (auth.jwt() ->> 'email') = 'palsulearav934@gmail.com'
  )
  with check (
    bucket_id = 'portfolio-media'
    and (auth.jwt() ->> 'email') = 'palsulearav934@gmail.com'
  );

drop policy if exists "Portfolio owner can remove certificate images" on storage.objects;
create policy "Portfolio owner can remove certificate images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (auth.jwt() ->> 'email') = 'palsulearav934@gmail.com'
  );
