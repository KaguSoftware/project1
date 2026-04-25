-- =============================================================================
-- 0005_access_requests.sql — Viewer → Editor access request workflow
--
-- Viewers can request editor access on documents shared with them.
-- Document owners and global admins can approve or deny requests.
-- =============================================================================

-- ============================================================
-- 1. TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.access_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'denied')),
  message     TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One active request per user per document at a time
  UNIQUE (document_id, requester_id)
);

CREATE INDEX IF NOT EXISTS idx_access_requests_doc    ON public.access_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_user   ON public.access_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON public.access_requests(status);

DROP TRIGGER IF EXISTS trg_access_requests_updated_at ON public.access_requests;
CREATE TRIGGER trg_access_requests_updated_at
  BEFORE UPDATE ON public.access_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Requester can see their own requests.
-- Document owner and global admins can see all requests for their documents.
DROP POLICY IF EXISTS "access_requests_select" ON public.access_requests;
CREATE POLICY "access_requests_select"
  ON public.access_requests FOR SELECT
  USING (
    public.is_admin()
    OR requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = access_requests.document_id AND owner_id = auth.uid()
    )
  );

-- Only the viewer themselves can open a request (must already have a viewer grant)
DROP POLICY IF EXISTS "access_requests_insert" ON public.access_requests;
CREATE POLICY "access_requests_insert"
  ON public.access_requests FOR INSERT
  WITH CHECK (
    requester_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.document_access
      WHERE document_id = access_requests.document_id
        AND user_id = auth.uid()
        AND role = 'viewer'
    )
  );

-- Only the document owner or global admin can update (approve/deny)
DROP POLICY IF EXISTS "access_requests_update" ON public.access_requests;
CREATE POLICY "access_requests_update"
  ON public.access_requests FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = access_requests.document_id AND owner_id = auth.uid()
    )
  );

-- Requester can withdraw (delete) their own pending request; owner/admin can delete too
DROP POLICY IF EXISTS "access_requests_delete" ON public.access_requests;
CREATE POLICY "access_requests_delete"
  ON public.access_requests FOR DELETE
  USING (
    public.is_admin()
    OR requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = access_requests.document_id AND owner_id = auth.uid()
    )
  );

-- ============================================================
-- 3. SECURITY DEFINER RPCs
-- ============================================================

-- ── request_editor_access(doc_id) ─────────────────────────────────────────────
-- Called by a viewer to open (or re-open after denial) a request.
-- Upserts so a denied user can try again; resets status to 'pending'.
CREATE OR REPLACE FUNCTION public.request_editor_access(doc_id UUID, msg TEXT DEFAULT NULL)
RETURNS public.access_requests AS $$
DECLARE
  result public.access_requests;
BEGIN
  -- Verify caller is a viewer on this document
  IF NOT EXISTS (
    SELECT 1 FROM public.document_access
    WHERE document_id = doc_id AND user_id = auth.uid() AND role = 'viewer'
  ) THEN
    RAISE EXCEPTION 'You must be a viewer on this document to request editor access';
  END IF;

  INSERT INTO public.access_requests (document_id, requester_id, status, message)
  VALUES (doc_id, auth.uid(), 'pending', msg)
  ON CONFLICT (document_id, requester_id)
  DO UPDATE SET status = 'pending', message = EXCLUDED.message,
                reviewed_by = NULL, reviewed_at = NULL, updated_at = now()
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── review_access_request(request_id, new_status) ────────────────────────────
-- Called by the document owner or a global admin to approve or deny a request.
-- On approval, upserts the document_access row to 'editor'.
CREATE OR REPLACE FUNCTION public.review_access_request(
  request_id UUID,
  new_status TEXT  -- 'approved' | 'denied'
)
RETURNS public.access_requests AS $$
DECLARE
  req public.access_requests;
  result public.access_requests;
BEGIN
  IF new_status NOT IN ('approved', 'denied') THEN
    RAISE EXCEPTION 'new_status must be approved or denied';
  END IF;

  SELECT * INTO req FROM public.access_requests WHERE id = request_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  -- Caller must be the document owner or global admin
  IF NOT (
    public.is_admin()
    OR EXISTS (SELECT 1 FROM public.documents WHERE id = req.document_id AND owner_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Not authorised to review this request';
  END IF;

  UPDATE public.access_requests
  SET status = new_status, reviewed_by = auth.uid(), reviewed_at = now(), updated_at = now()
  WHERE id = request_id
  RETURNING * INTO result;

  -- On approval: upgrade the viewer grant to editor
  IF new_status = 'approved' THEN
    INSERT INTO public.document_access (document_id, user_id, role, granted_by)
    VALUES (req.document_id, req.requester_id, 'editor', auth.uid())
    ON CONFLICT (document_id, user_id)
    DO UPDATE SET role = 'editor', granted_by = auth.uid();
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── list_pending_requests_for_document(doc_id) ────────────────────────────────
-- Returns pending requests enriched with requester display_name and email.
-- Only callable by the document owner or a global admin (enforced inside function).
CREATE OR REPLACE FUNCTION public.list_pending_requests_for_document(doc_id UUID)
RETURNS TABLE (
  id           UUID,
  document_id  UUID,
  requester_id UUID,
  status       TEXT,
  message      TEXT,
  created_at   TIMESTAMPTZ,
  display_name TEXT,
  email        TEXT
) AS $$
BEGIN
  IF NOT (
    public.is_admin()
    OR EXISTS (SELECT 1 FROM public.documents WHERE id = doc_id AND owner_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  RETURN QUERY
    SELECT
      ar.id, ar.document_id, ar.requester_id, ar.status, ar.message, ar.created_at,
      COALESCE(p.display_name, p.email) AS display_name,
      p.email
    FROM public.access_requests ar
    JOIN public.profiles p ON p.id = ar.requester_id
    WHERE ar.document_id = doc_id AND ar.status = 'pending'
    ORDER BY ar.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── list_all_pending_requests() ───────────────────────────────────────────────
-- Returns all pending requests across every document the caller owns (or all
-- documents if the caller is a global admin). Also includes the document title
-- so the UI can display it without a separate fetch.
CREATE OR REPLACE FUNCTION public.list_all_pending_requests()
RETURNS TABLE (
  id            UUID,
  document_id   UUID,
  document_title TEXT,
  requester_id  UUID,
  status        TEXT,
  message       TEXT,
  created_at    TIMESTAMPTZ,
  display_name  TEXT,
  email         TEXT
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      ar.id, ar.document_id, d.title AS document_title,
      ar.requester_id, ar.status, ar.message, ar.created_at,
      COALESCE(p.display_name, p.email) AS display_name,
      p.email
    FROM public.access_requests ar
    JOIN public.documents  d ON d.id  = ar.document_id
    JOIN public.profiles   p ON p.id  = ar.requester_id
    WHERE ar.status = 'pending'
      AND (public.is_admin() OR d.owner_id = auth.uid())
    ORDER BY ar.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── get_my_request_status(doc_id) ─────────────────────────────────────────────
-- Returns the current user's request row for a document (or NULL if none).
CREATE OR REPLACE FUNCTION public.get_my_request_status(doc_id UUID)
RETURNS public.access_requests AS $$
DECLARE
  result public.access_requests;
BEGIN
  SELECT * INTO result
  FROM public.access_requests
  WHERE document_id = doc_id AND requester_id = auth.uid()
  LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
