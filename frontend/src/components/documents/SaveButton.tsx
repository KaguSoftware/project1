"use client";

/**
 * SaveButton — inserts a new document row or updates the existing one.
 *
 * Visibility / state rules:
 *  - No user logged in         → visible but disabled, tooltip "Sign in to save"
 *  - Viewer role               → hidden entirely
 *  - Editor or Owner           → active
 *  - No document loaded yet    → active (will INSERT on first save)
 */

import { useState } from "react";
import { useAppStore } from "@/src/store";
import { saveDocument } from "@/src/lib/db/documents";
import { usePermissions } from "@/src/lib/permissions";

export function SaveButton() {
  const user = useAppStore((s) => s.user);
  const document = useAppStore((s) => s.document);
  const language = useAppStore((s) => s.language);
  const hiddenFields = useAppStore((s) => s.hiddenFields);
  const currentDocumentId = useAppStore((s) => s.currentDocumentId);
  const isSaving = useAppStore((s) => s.isSaving);
  const setIsSaving = useAppStore((s) => s.setIsSaving);
  const setCurrentDocumentId = useAppStore((s) => s.setCurrentDocumentId);
  const { canEdit, role } = usePermissions();

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Viewer on a loaded doc — hide entirely
  if (currentDocumentId && role === "viewer") return null;

  // Editor/owner on a loaded doc — also hide if they somehow lack canEdit
  if (currentDocumentId && !canEdit) return null;

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      const title =
        document.projectTitle?.trim() ||
        `Untitled ${document.type}`;

      const content = {
        document,
        language,
        hiddenFields,
      };

      const saved = await saveDocument({
        id: currentDocumentId ?? undefined,
        title,
        doc_type: document.type,
        content: content as Record<string, unknown>,
      });

      setCurrentDocumentId(saved.id);
      showToast("success", "Saved!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      showToast("error", msg);
    } finally {
      setIsSaving(false);
    }
  }

  const isLoggedOut = !user;

  return (
    <div className="relative group">
      <button
        onClick={handleSave}
        disabled={isLoggedOut || isSaving}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
          ${isLoggedOut
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            : "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
          }
          ${isSaving ? "opacity-70" : ""}
        `}
      >
        {isSaving ? (
          <>
            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </>
        )}
      </button>

      {/* Tooltip for logged-out state */}
      {isLoggedOut && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-700 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
          Sign in to save
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
        </div>
      )}

      {/* Success / error toast */}
      {toast && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap z-50 shadow-md
            ${toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
            }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
