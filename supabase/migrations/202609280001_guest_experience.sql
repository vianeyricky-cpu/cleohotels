begin;
-- Additive migration: existing Hotel/Room/Facility/promo data is untouched.
create table if not exists public.hotel_concierge (
  hotel_slug text primary key,
  knowledge text not null default '' check (length(knowledge) <= 12000),
  updated_at timestamptz not null default now()
);
create table if not exists public.hotel_tours (
  hotel_slug text primary key,
  scenes jsonb not null default '[]'::jsonb check (jsonb_typeof(scenes) = 'array' and jsonb_array_length(scenes) <= 40),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.hotel_concierge enable row level security;
alter table public.hotel_tours enable row level security;
create policy concierge_read on public.hotel_concierge for select to anon, authenticated using (true);
create policy concierge_admin on public.hotel_concierge for all to authenticated
  using ((auth.jwt()->'app_metadata'->>'cleo_admin') = 'true')
  with check ((auth.jwt()->'app_metadata'->>'cleo_admin') = 'true' and exists (select 1 from public."Hotel" h where h.slug = hotel_slug));
create policy tours_read on public.hotel_tours for select to anon, authenticated using (published);
create policy tours_admin on public.hotel_tours for all to authenticated
  using ((auth.jwt()->'app_metadata'->>'cleo_admin') = 'true')
  with check ((auth.jwt()->'app_metadata'->>'cleo_admin') = 'true' and exists (select 1 from public."Hotel" h where h.slug = hotel_slug));
grant select on public.hotel_concierge, public.hotel_tours to anon;
grant select, insert, update, delete on public.hotel_concierge, public.hotel_tours to authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cleo-panoramas', 'cleo-panoramas', true, 20971520, array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy panorama_read on storage.objects for select to anon, authenticated using (bucket_id = 'cleo-panoramas');
create policy panorama_admin on storage.objects for all to authenticated
  using (bucket_id = 'cleo-panoramas' and (auth.jwt()->'app_metadata'->>'cleo_admin') = 'true')
  with check (bucket_id = 'cleo-panoramas' and (auth.jwt()->'app_metadata'->>'cleo_admin') = 'true');
-- Atomic, shared rate limiting across Vercel instances. No chat text / raw IP is stored.
create table if not exists public.concierge_limits (key text primary key, bucket bigint not null, hits integer not null);
alter table public.concierge_limits enable row level security;
revoke all on public.concierge_limits from anon, authenticated;
create or replace function public.take_concierge_quota(p_key text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer; b bigint := floor(extract(epoch from now()) / p_seconds);
begin
  insert into concierge_limits(key, bucket, hits) values(p_key, b, 1)
  on conflict(key) do update set bucket=b, hits=case when concierge_limits.bucket=b then concierge_limits.hits+1 else 1 end
  returning hits into n;
  delete from concierge_limits where bucket < floor(extract(epoch from now()) / p_seconds) - 2 and key like split_part(p_key, ':', 1) || ':%';
  return n <= p_limit;
end; $$;
revoke all on function public.take_concierge_quota(text, integer, integer) from public, anon, authenticated;
grant execute on function public.take_concierge_quota(text, integer, integer) to service_role;
commit;
