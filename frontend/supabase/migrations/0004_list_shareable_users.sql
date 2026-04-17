-- =============================================================================
-- 0004_list_shareable_users.sql — RPC to list all users for the share picker
--
-- Regular users cannot query profiles directly (RLS blocks it).
-- This SECURITY DEFINER function lets any authenticated user fetch a list of
-- all other users (id, email, display_name) so the share modal can render a
-- searchable user picker without exposing sensitive profile data.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.list_shareable_users()
RETURNS TABLE (id UUID, email TEXT, display_name TEXT) AS $$
BEGIN
  RETURN QUERY
    SELECT p.id, p.email, p.display_name
    FROM public.profiles p
    WHERE p.id != auth.uid()
    ORDER BY p.display_name, p.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
