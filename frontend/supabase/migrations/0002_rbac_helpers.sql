-- =============================================================================
-- 0002_rbac_helpers.sql — Phase 3: RBAC helper functions
--
-- Run this AFTER 0001_init.sql.
-- Idempotent (CREATE OR REPLACE for functions).
-- =============================================================================

-- ============================================================
-- 1. get_my_role(doc_id UUID) → TEXT
-- ============================================================
-- Returns the effective role of the calling user on a given document:
--   'owner'  — the user is the document's owner
--   'editor' — user has a document_access row with role='editor'
--   'viewer' — user has a document_access row with role='viewer'
--   NULL     — user has no relationship to the document
--
-- SECURITY DEFINER so it can read document_access and documents without
-- triggering the document_access RLS select policy (which would create
-- a recursive evaluation). Called from the browser client via supabase.rpc().
--
-- Note: RLS on the documents table still applies when the calling user
-- tries to SELECT/UPDATE/DELETE the document itself. This function only
-- tells the UI which role label to show — it does NOT grant access.
CREATE OR REPLACE FUNCTION public.get_my_role(doc_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_owner_id UUID;
  v_access_role TEXT;
BEGIN
  -- Check ownership
  SELECT owner_id INTO v_owner_id
  FROM public.documents
  WHERE id = doc_id;

  IF v_owner_id IS NULL THEN
    RETURN NULL; -- document doesn't exist (or caller can't see it)
  END IF;

  IF v_owner_id = auth.uid() THEN
    RETURN 'owner';
  END IF;

  -- Check granted access
  SELECT role INTO v_access_role
  FROM public.document_access
  WHERE document_id = doc_id AND user_id = auth.uid();

  RETURN v_access_role; -- 'editor', 'viewer', or NULL
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- 2. admin_set_user_role(target_user_id UUID, new_role TEXT)
-- ============================================================
-- Updates a user's app_role. SECURITY DEFINER so the anon key is sufficient
-- for the UPDATE — but the function itself checks the caller is an admin
-- before proceeding. This prevents non-admins from calling the RPC to
-- escalate their own privileges.
--
-- The profiles_update_own RLS policy only allows users to update their
-- OWN profile. This function bypasses that to let admins update any profile.
CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Caller must be an admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: caller is not an admin';
  END IF;

  -- Validate role value
  IF new_role NOT IN ('admin', 'member', 'client') THEN
    RAISE EXCEPTION 'Invalid role: %. Must be admin, member, or client', new_role;
  END IF;

  UPDATE public.profiles
  SET app_role = new_role
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
