
-- profiles additions
alter table public.profiles
  add column if not exists is_verified boolean not null default false,
  add column if not exists tagline text not null default '',
  add column if not exists cover_url text not null default '',
  add column if not exists bg_video_url text not null default '',
  add column if not exists bg_animated boolean not null default false,
  add column if not exists font_family text not null default 'inter',
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists whatsapp_number text not null default '',
  add column if not exists booking_url text not null default '',
  add column if not exists accent_color text not null default '';

-- links additions
alter table public.links
  add column if not exists link_type text not null default 'link',
  add column if not exists icon text not null default '',
  add column if not exists thumbnail_url text not null default '',
  add column if not exists color text not null default '',
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_pinned boolean not null default false,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

-- email_subscribers table
create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  name text not null default '',
  source text not null default 'profile',
  created_at timestamptz not null default now(),
  unique (profile_id, email)
);

alter table public.email_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.email_subscribers for insert
  with check (true);

create policy "Owners view their subscribers"
  on public.email_subscribers for select
  using (exists (select 1 from public.profiles p where p.id = email_subscribers.profile_id and p.id = auth.uid()));

create policy "Owners delete their subscribers"
  on public.email_subscribers for delete
  using (exists (select 1 from public.profiles p where p.id = email_subscribers.profile_id and p.id = auth.uid()));

create index if not exists email_subscribers_profile_idx on public.email_subscribers(profile_id);
create index if not exists links_profile_position_idx on public.links(profile_id, position);
