revoke execute on function public.has_pro_access(uuid) from public, anon, authenticated;
revoke execute on function public.validate_profile_feature_access() from public, anon, authenticated;
revoke execute on function public.validate_link_feature_access() from public, anon, authenticated;
revoke execute on function public.sync_profile_is_pro() from public, anon, authenticated;