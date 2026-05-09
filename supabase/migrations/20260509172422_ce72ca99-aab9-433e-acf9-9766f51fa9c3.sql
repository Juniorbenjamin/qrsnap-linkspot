
drop policy if exists "Anyone can subscribe" on public.email_subscribers;

create policy "Anyone can subscribe to existing profiles"
  on public.email_subscribers for insert
  with check (
    length(email) between 3 and 254
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(coalesce(name, '')) <= 120
    and exists (select 1 from public.profiles p where p.id = email_subscribers.profile_id)
  );
