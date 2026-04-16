/**
 * usePermissions — returns the effective capabilities for the current user
 * on the currently-loaded document.
 *
 * ┌───────────────┬─────────┬─────────┬──────────┬──────────┐
 * │               │canView  │canEdit  │canDelete │canShare  │
 * ├───────────────┼─────────┼─────────┼──────────┼──────────┤
 * │ admin         │  true   │  true   │  true    │  true    │
 * │ owner         │  true   │  true   │  true    │  true    │
 * │ editor share  │  true   │  true   │  false   │  false   │
 * │ viewer share  │  true   │  false  │  false   │  false   │
 * │ none/anon     │  false  │  false  │  false   │  false   │
 * └───────────────┴─────────┴─────────┴──────────┴──────────┘
 *
 * SECURITY NOTE: These checks are purely for UX — they drive which buttons
 * render and whether inputs are disabled. Real enforcement is done by Supabase
 * RLS policies on documents and document_access. A viewer bypassing the UI and
 * calling the Supabase client directly will be rejected at the database level.
 */

import { useAppStore } from "@/src/store";
import type { DocumentRole } from "@/src/store/types";

export interface Permissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  /** The effective role, or null when no document is loaded / anonymous */
  role: DocumentRole | null;
}

export function usePermissions(): Permissions {
  const user = useAppStore((s) => s.user);
  const currentDocumentId = useAppStore((s) => s.currentDocumentId);
  const currentDocumentRole = useAppStore((s) => s.currentDocumentRole);

  // Anonymous or no document loaded → no permissions
  if (!user || !currentDocumentId) {
    return { canView: false, canEdit: false, canDelete: false, canShare: false, role: null };
  }

  // Admin global role → full access regardless of document ownership
  if (user.app_role === "admin") {
    return { canView: true, canEdit: true, canDelete: true, canShare: true, role: "owner" };
  }

  switch (currentDocumentRole) {
    case "owner":
      return { canView: true, canEdit: true, canDelete: true, canShare: true, role: "owner" };
    case "editor":
      return { canView: true, canEdit: true, canDelete: false, canShare: false, role: "editor" };
    case "viewer":
      return { canView: true, canEdit: false, canDelete: false, canShare: false, role: "viewer" };
    default:
      return { canView: false, canEdit: false, canDelete: false, canShare: false, role: null };
  }
}
