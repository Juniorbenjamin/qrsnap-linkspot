create or replace function public.has_pro_access(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(public.has_role(_user_id, 'admin'::public.app_role), false)
    or coalesce(public.has_active_subscription(_user_id, 'live'), false)
    or coalesce(public.has_active_subscription(_user_id, 'sandbox'), false)
    or exists (
      select 1
      from public.profiles p
      where p.id = _user_id
        and p.is_pro = true
    )
$$;

create or replace function public.validate_profile_feature_access()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_user uuid := auth.uid();
  privileged boolean := false;
begin
  privileged := acting_user is null
    or auth.role() = 'service_role'
    or public.has_role(acting_user, 'admin'::public.app_role);

  if privileged then
    return new;
  end if;

  if new.is_pro is distinct from old.is_pro then
    raise exception 'Only administrators can change plan status';
  end if;

  if not public.has_pro_access(old.id) then
    if new.qr_color is distinct from old.qr_color
      or new.qr_bg is distinct from old.qr_bg
      or new.logo_text is distinct from old.logo_text
      or new.is_verified is distinct from old.is_verified
      or new.cover_url is distinct from old.cover_url
      or new.bg_video_url is distinct from old.bg_video_url
      or new.bg_animated is distinct from old.bg_animated
      or new.font_family is distinct from old.font_family
      or new.accent_color is distinct from old.accent_color
      or (new.theme is distinct from old.theme and new.theme <> 'midnight')
    then
      raise exception 'Upgrade required for premium profile features';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_profile_feature_access_before_update on public.profiles;
create trigger validate_profile_feature_access_before_update
before update on public.profiles
for each row execute function public.validate_profile_feature_access();

create or replace function public.validate_link_feature_access()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid := coalesce(new.profile_id, old.profile_id);
  current_count integer;
begin
  if public.has_pro_access(owner_id) then
    return new;
  end if;

  if new.link_type not in ('link', 'header', 'whatsapp') then
    raise exception 'Upgrade required for this block type';
  end if;

  if tg_op = 'INSERT' then
    select count(*) into current_count
    from public.links
    where profile_id = new.profile_id;

    if current_count >= 4 then
      raise exception 'Free plan link limit reached';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_link_feature_access_before_insert_update on public.links;
create trigger validate_link_feature_access_before_insert_update
before insert or update on public.links
for each row execute function public.validate_link_feature_access();

create or replace function public.sync_profile_is_pro()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user uuid;
begin
  target_user := coalesce(new.user_id, old.user_id);
  update public.profiles
    set is_pro = (
      public.has_role(target_user, 'admin'::public.app_role)
      or public.has_active_subscription(target_user, 'live')
      or public.has_active_subscription(target_user, 'sandbox')
    ),
    updated_at = now()
  where id = target_user;
  return new;
end;
$$;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can update their own links" on public.links;
create policy "Users can update their own links"
on public.links
for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = links.profile_id
      and p.id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = links.profile_id
      and p.id = auth.uid()
  )
);

drop policy if exists "Admins manage mockup slides update" on public.mockup_slides;
create policy "Admins manage mockup slides update"
on public.mockup_slides
for update
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));