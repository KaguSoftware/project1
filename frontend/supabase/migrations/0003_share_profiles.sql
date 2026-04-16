-- =============================================================================
-- 0003_share_profiles.sql — helper to fetch profiles for share modal
--
-- The profiles_select_own_or_admin RLS policy blocks document owners from
-- reading other users' profiles directly. This SECURITY DEFINER function
-- bypasses that so the share modal can show names/emails instead of UUIDs.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_profiles_for_users(user_ids UUID[])
RETURNS TABLE (id UUID, email TEXT, display_name TEXT) AS $$
BEGIN
  RETURN QUERY
    SELECT p.id, p.email, p.display_name
    FROM public.profiles p
    WHERE p.id = ANY(user_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
