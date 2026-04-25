// TypeScript types matching the Supabase schema defined in
// supabase/migrations/0001_init.sql

/** app_role CHECK constraint values on profiles.app_role */
export type GlobalRole = 'admin' | 'member' | 'client'

/** role CHECK constraint values on document_access.role */
export type DocumentRole = 'editor' | 'viewer'

/** Row shape for the public.profiles table */
export interface Profile {
  id: string
  email: string
  display_name: string | null
  app_role: GlobalRole
  created_at: string
  updated_at: string
}

/** Row shape for the public.documents table */
export interface SavedDocument {
  id: string
  owner_id: string
  title: string
  doc_type: string
  /** Full DocumentData object serialised as JSONB */
  content: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Lightweight listing type — omits the heavy content blob */
export type SavedDocumentMeta = Omit<SavedDocument, 'content'> & {
  /** Populated only in the "shared with me" list — the role the current user was granted */
  shared_role?: "editor" | "viewer"
}

/** Row shape for the public.document_access table */
export interface DocumentShare {
  id: string
  document_id: string
  user_id: string
  role: DocumentRole
  granted_by: string | null
  created_at: string
  /** Populated by listSharesForDocument join — display name or email of the grantee */
  display_name?: string
}

/** Return type of the find_user_by_email() RPC */
export interface UserLookup {
  id: string
  email: string
}

/** Return type of get_my_role() RPC */
export type MyDocumentRole = "owner" | "editor" | "viewer" | null

/** Row shape for public.profiles (admin use) */
export interface ProfileRow {
  id: string
  email: string
  display_name: string | null
  app_role: "admin" | "member" | "client"
  created_at: string
  updated_at: string
}

/** Full document row including owner email (joined for admin panel) */
export interface DocumentWithOwner extends SavedDocumentMeta {
  owner_email?: string
}

/** Status of an access request */
export type AccessRequestStatus = 'pending' | 'approved' | 'denied'

/** Row shape for public.access_requests */
export interface AccessRequest {
  id: string
  document_id: string
  requester_id: string
  status: AccessRequestStatus
  message: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

/** Enriched request row returned by list_pending_requests_for_document RPC */
export interface PendingAccessRequest {
  id: string
  document_id: string
  requester_id: string
  status: AccessRequestStatus
  message: string | null
  created_at: string
  display_name: string
  email: string
}
