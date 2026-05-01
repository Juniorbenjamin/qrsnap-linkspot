-- Pin search_path on the trigger function and revoke EXECUTE so only the
-- trigger context can run it.
alter function public.touch_updated_at() set search_path = public;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Tighten the analytics insert policy: an event can only be recorded for a
-- (profile_id, link_id) pair where the link actually belongs to that profile,
-- and event_type/source must be valid. This prevents drive-by inflation of
-- random users' analytics.
drop policy if exists "Anyone can insert scan events" on public.scan_events;

create policy "Anyone can insert valid scan events"
  on public.scan_events
  for insert
  with check (
    event_type in ('view','scan','click')
    and (source is null or source in ('qr','direct'))
    and (
      link_id is null
      or exists (
        select 1 from public.links l
        where l.id = link_id and l.profile_id = scan_events.profile_id
      )
    )
  );