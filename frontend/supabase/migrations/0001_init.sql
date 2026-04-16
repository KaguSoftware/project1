-- =============================================================================
-- 0001_init.sql — Cloud Save & RBAC schema
--
-- Idempotent where possible (CREATE ... IF NOT EXISTS, CREATE OR REPLACE).
-- Run this once against your Supabase project via the SQL Editor or CLI.
-- =============================================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. PROFILES (mirrors auth.users, populated via trigger)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  display_name TEXT,
  app_role    TEXT NOT NULL DEFAULT 'member'
              CHECK (app_role IN ('admin', 'member', 'client')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger so this script stays idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. DOCUMENTS (with 500 KB content CHECK)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Untitled',
  doc_type    TEXT NOT NULL DEFAULT 'proposal',
  -- Guard against accidental mega-documents (~500 KB limit).
  -- content stores the full DocumentData object as JSON.
  content     JSONB NOT NULL DEFAULT '{}' CHECK (pg_column_size(content) < 500000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. set_updated_at function + triggers on profiles and documents
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_documents_updated_at ON public.documents;
CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. DOCUMENT ACCESS (per-document sharing)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.document_access (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- No 'owner' role here — ownership is tracked solely via documents.owner_id.
  -- This table is only for granted access (editor / viewer).
  role        TEXT NOT NULL DEFAULT 'viewer'
              CHECK (role IN ('editor', 'viewer')),
  granted_by  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (document_id, user_id)
);

-- ============================================================
-- 6. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_documents_owner ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_doc_access_user ON public.document_access(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_access_doc  ON public.document_access(document_id);

-- ============================================================
-- 7. ENABLE ROW LEVEL SECURITY on all three tables
-- ============================================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. SECURITY DEFINER helper functions
-- ============================================================

-- ── public.is_admin() ─────────────────────────────────────────────────────────
-- SECURITY DEFINER so it reads profiles with elevated privileges,
-- bypassing the restrictive profiles RLS policy below. Without this,
-- every RLS policy that needs an admin check would embed its own
-- EXISTS subquery against profiles — creating a circular RLS
-- dependency (profiles policies would fire during documents policy
-- evaluation) and duplicating logic in 7+ places. A single
-- SECURITY DEFINER function is the canonical Supabase pattern:
-- one place to audit, no circular evaluation, better plan caching.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND app_role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── public.find_user_by_email(text) ──────────────────────────────────────────
-- Returns just {id, email} for a given email address.
-- SECURITY DEFINER so it bypasses profiles RLS — callers cannot
-- enumerate profiles or see display_name/app_role. The ShareModal
-- MUST call this function via supabase.rpc('find_user_by_email', { email })
-- instead of querying the profiles table directly.
CREATE OR REPLACE FUNCTION public.find_user_by_email(lookup_email TEXT)
RETURNS TABLE (id UUID, email TEXT) AS $$
  SELECT p.id, p.email
  FROM public.profiles p
  WHERE p.email = lookup_email
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- 9. RLS POLICIES
-- ============================================================

-- ── PROFILES ──────────────────────────────────────────────────

-- Users can only read their own profile. Admins can read all.
-- Share-by-email lookups go through find_user_by_email() instead.
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can only update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── DOCUMENTS ─────────────────────────────────────────────────

-- Admins see all documents.
-- Non-admins see documents they own OR have been granted access to.
DROP POLICY IF EXISTS "documents_select" ON public.documents;
CREATE POLICY "documents_select"
  ON public.documents FOR SELECT
  USING (
    public.is_admin()
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.document_access
      WHERE document_id = documents.id AND user_id = auth.uid()
    )
  );

-- Only the document owner can insert (enforced: owner_id must match auth.uid)
DROP POLICY IF EXISTS "documents_insert" ON public.documents;
CREATE POLICY "documents_insert"
  ON public.documents FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Owner and editors can update a document.
-- Admins can also update any document.
DROP POLICY IF EXISTS "documents_update" ON public.documents;
CREATE POLICY "documents_update"
  ON public.documents FOR UPDATE
  USING (
    public.is_admin()
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.document_access
      WHERE document_id = documents.id AND user_id = auth.uid() AND role = 'editor'
    )
  );

-- Only the owner (or admin) can delete a document
DROP POLICY IF EXISTS "documents_delete" ON public.documents;
CREATE POLICY "documents_delete"
  ON public.documents FOR DELETE
  USING (
    public.is_admin()
    OR owner_id = auth.uid()
  );

-- ── DOCUMENT ACCESS ───────────────────────────────────────────

-- Users can see access entries for documents they can already see
DROP POLICY IF EXISTS "doc_access_select" ON public.document_access;
CREATE POLICY "doc_access_select"
  ON public.document_access FOR SELECT
  USING (
    public.is_admin()
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_access.document_id AND owner_id = auth.uid()
    )
  );

-- Only the document owner (or admin) can grant access
DROP POLICY IF EXISTS "doc_access_insert" ON public.document_access;
CREATE POLICY "doc_access_insert"
  ON public.document_access FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_access.document_id AND owner_id = auth.uid()
    )
  );

-- Only the document owner (or admin) can modify access grants
DROP POLICY IF EXISTS "doc_access_update" ON public.document_access;
CREATE POLICY "doc_access_update"
  ON public.document_access FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_access.document_id AND owner_id = auth.uid()
    )
  );

-- Only the document owner (or admin) can revoke access
DROP POLICY IF EXISTS "doc_access_delete" ON public.document_access;
CREATE POLICY "doc_access_delete"
  ON public.document_access FOR DELETE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_access.document_id AND owner_id = auth.uid()
    )
  );
