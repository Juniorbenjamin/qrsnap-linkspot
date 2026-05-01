-- PROFILES: one row per auth user
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null default 'Your Name',
  bio text not null default '',
  avatar_emoji text not null default '✨',
  theme text not null default 'midnight',
  qr_color text not null default '#1a1a2e',
  qr_bg text not null default '#ffffff',
  logo_text text not null default '',
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- public read for the link-in-bio page
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete using (auth.uid() = id);

-- LINKS
create table public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index links_profile_id_position_idx on public.links(profile_id, position);

alter table public.links enable row level security;

create policy "Links are viewable by everyone"
  on public.links for select using (true);

create policy "Users can insert their own links"
  on public.links for insert with check (
    exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  );

create policy "Users can update their own links"
  on public.links for update using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  );

create policy "Users can delete their own links"
  on public.links for delete using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  );

-- SCAN / CLICK / VIEW EVENTS
create table public.scan_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  link_id uuid references public.links(id) on delete set null,
  event_type text not null check (event_type in ('view','scan','click')),
  source text check (source in ('qr','direct')),
  created_at timestamptz not null default now()
);

create index scan_events_profile_created_idx on public.scan_events(profile_id, created_at desc);
create index scan_events_link_idx on public.scan_events(link_id);

alter table public.scan_events enable row level security;

-- anyone (even anon) can record an event — that's how QR scans from strangers get counted
create policy "Anyone can insert scan events"
  on public.scan_events for insert with check (true);

-- only the profile owner sees their analytics
create policy "Owners can view their scan events"
  on public.scan_events for select using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  );

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := coalesce(
    nullif(regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9-]', '', 'g'), ''),
    'user'
  );
  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, coalesce(new.raw_user_meta_data->>'display_name', base_username));

  -- Seed with one starter link so the page isn't empty
  insert into public.links (profile_id, title, url, position)
  values (new.id, '🌐 My Website', 'https://example.com', 0);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();