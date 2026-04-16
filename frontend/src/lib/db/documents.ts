// Database access layer for documents and sharing.
//
// All functions use the browser Supabase client and rely entirely on
// Row-Level Security (RLS) for authorization — no manual permission checks here.
// RLS policies on public.documents and public.document_access enforce ownership
// and role-based access at the database level.

import { createClient } from '@/src/lib/supabase/client'
import type {
  SavedDocument,
  SavedDocumentMeta,
  DocumentShare,
  DocumentRole,
  UserLookup,
  MyDocumentRole,
  ProfileRow,
  DocumentWithOwner,
} from './types'

// ── Save / Update ─────────────────────────────────────────────────────────────

/**
 * Insert or update a document.
 *
 * Pass `id` to update an existing document (owner_id in the row must match
 * the current user — enforced by RLS). Omit `id` to create a new document.
 *
 * `content` should be the full DocumentData object serialized to JSON.
 */
export async function saveDocument(params: {
  id?: string
  title: string
  doc_type: string
  content: Record<string, unknown>
}): Promise<SavedDocument> {
  const supabase = createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  if (params.id) {
    // Update existing document (RLS ensures only owner/editor can update)
    const { data, error } = await supabase
      .from('documents')
      .update({
        title: params.title,
        doc_type: params.doc_type,
        content: params.content,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return data as SavedDocument
  } else {
    // Insert new document — owner_id must equal auth.uid() per RLS insert policy
    const { data, error } = await supabase
      .from('documents')
      .insert({
        owner_id: user.id,
        title: params.title,
        doc_type: params.doc_type,
        content: params.content,
      })
      .select()
      .single()

    if (error) throw error
    return data as SavedDocument
  }
}

// ── Load ──────────────────────────────────────────────────────────────────────

/**
 * Load a single document by ID.
 * RLS ensures the caller can only fetch documents they own or have access to.
 */
export async function loadDocument(id: string): Promise<SavedDocument> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as SavedDocument
}

// ── List ──────────────────────────────────────────────────────────────────────

/**
 * List all documents visible to the current user (owned + shared).
 * Returns lightweight meta objects without the heavy `content` blob.
 */
export async function listMyDocuments(): Promise<SavedDocumentMeta[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('documents')
    .select('id, owner_id, title, doc_type, created_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SavedDocumentMeta[]
}

// ── Delete ────────────────────────────────────────────────────────────────────

/**
 * Delete a document by ID.
 * RLS restricts this to the owner and admins.
 */
export async function deleteDocument(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('documents').delete().eq('id', id)

  if (error) throw error
}

// ── Sharing ───────────────────────────────────────────────────────────────────

/**
 * Grant a user access to a document.
 *
 * Resolves the target user by email via the `find_user_by_email` RPC — never
 * queries the profiles table directly (RLS blocks it for non-admins).
 *
 * RLS on document_access restricts insert to the document owner and admins.
 */
export async function shareDocument(params: {
  documentId: string
  email: string
  role: DocumentRole
}): Promise<DocumentShare> {
  const supabase = createClient()

  // Resolve email → user id via SECURITY DEFINER function (bypasses profiles RLS)
  const { data: users, error: lookupError } = await supabase.rpc(
    'find_user_by_email',
    { lookup_email: params.email }
  )

  if (lookupError) throw lookupError

  const userList = users as UserLookup[] | null
  if (!userList || userList.length === 0) {
    throw new Error(`No user found with email: ${params.email}`)
  }

  const targetUserId = userList[0].id

  const { data, error } = await supabase
    .from('document_access')
    .upsert(
      {
        document_id: params.documentId,
        user_id: targetUserId,
        role: params.role,
      },
      { onConflict: 'document_id,user_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data as DocumentShare
}

/**
 * Revoke a user's access to a document.
 * RLS restricts this to the document owner and admins.
 */
export async function unshareDocument(params: {
  documentId: string
  userId: string
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('document_access')
    .delete()
    .eq('document_id', params.documentId)
    .eq('user_id', params.userId)

  if (error) throw error
}

/**
 * List all access grants for a given document.
 * RLS allows this for the document owner and admins.
 */
export async function listSharesForDocument(
  documentId: string
): Promise<DocumentShare[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('document_access')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as DocumentShare[]
}

// ── Role resolution ───────────────────────────────────────────────────────────

/**
 * Get the current user's effective role on a document via the
 * `get_my_role(doc_id)` RPC. Returns "owner" | "editor" | "viewer" | null.
 *
 * This is called after loading a document so the store can be updated with
 * `setCurrentDocumentRole`, which drives all permission-gated UI.
 */
export async function getMyRole(documentId: string): Promise<MyDocumentRole> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_my_role', {
    doc_id: documentId,
  })

  if (error) throw error
  return (data as MyDocumentRole) ?? null
}

/**
 * Fetch the current user's profile (includes app_role so the UI can gate
 * admin-only sections without an extra round-trip on every render).
 */
export async function getMyProfile(): Promise<ProfileRow | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data as ProfileRow
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

/**
 * List all profiles. Restricted to admins by RLS
 * (profiles_select_own_or_admin policy).
 */
export async function adminListUsers(): Promise<ProfileRow[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ProfileRow[]
}

/**
 * Update a user's app_role. Admin-only (RLS + service-role enforced via RPC).
 * Uses the `admin_set_user_role` RPC which is SECURITY DEFINER, so the anon
 * key is sufficient — the function itself enforces the caller is an admin.
 */
export async function adminSetUserRole(params: {
  userId: string
  role: "admin" | "member" | "client"
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('admin_set_user_role', {
    target_user_id: params.userId,
    new_role: params.role,
  })

  if (error) throw error
}

/**
 * List all documents (admin view — includes owner info).
 * Non-admins will only see their own documents per the documents_select RLS policy.
 */
export async function adminListDocuments(): Promise<DocumentWithOwner[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('documents')
    .select('id, owner_id, title, doc_type, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data ?? []) as DocumentWithOwner[]).map((row) => ({
    ...row,
    owner_email: undefined,
  }))
}

/**
 * List documents shared with the current user (access role not ownership).
 * Returns the meta + the role granted.
 */
export async function listSharedWithMe(): Promise<SavedDocumentMeta[]> {
  const supabase = createClient()

  // Fetch access grants for the current user
  const { data: accessRows, error: accessError } = await supabase
    .from('document_access')
    .select('document_id, role')
    .order('created_at', { ascending: false })

  if (accessError) throw accessError
  if (!accessRows || accessRows.length === 0) return []

  type AccessRow = { document_id: string; role: "editor" | "viewer" }
  const rows = accessRows as AccessRow[]
  const ids = rows.map((r) => r.document_id)

  // Fetch the document meta separately — no cross-table join
  const { data: docs, error: docsError } = await supabase
    .from('documents')
    .select('id, owner_id, title, doc_type, created_at, updated_at')
    .in('id', ids)

  if (docsError) throw docsError

  const roleByDocId = new Map(rows.map((r) => [r.document_id, r.role]))
  return ((docs ?? []) as SavedDocumentMeta[]).map((doc) => ({
    ...doc,
    shared_role: roleByDocId.get(doc.id),
  }))
}
