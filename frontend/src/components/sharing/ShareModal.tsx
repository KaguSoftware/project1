"use client";

/**
 * ShareModal — lets document owners share a document by email and manage
 * existing access grants.
 *
 * - Email resolution uses `find_user_by_email` RPC (never queries profiles directly).
 * - Existing shares are listed with the granted role and a revoke button.
 * - Only rendered when the user has `canShare` permission (enforced by caller).
 *   The Supabase RLS policies on document_access independently enforce this.
 */

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/src/store";
import {
  listSharesForDocument,
  shareDocument,
  unshareDocument,
} from "@/src/lib/db/documents";
import type { DocumentShare, DocumentRole } from "@/src/lib/db/types";

interface ShareModalProps {
  onClose: () => void;
}

export function ShareModal({ onClose }: ShareModalProps) {
  const currentDocumentId = useAppStore((s) => s.currentDocumentId);

  const [shares, setShares] = useState<DocumentShare[]>([]);
  const [loadingShares, setLoadingShares] = useState(true);
  const [sharesError, setSharesError] = useState<string | null>(null);

  // Add-share form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<DocumentRole>("viewer");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // Revoke state
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchShares = useCallback(async () => {
    if (!currentDocumentId) return;
    setLoadingShares(true);
    setSharesError(null);
    try {
      const data = await listSharesForDocument(currentDocumentId);
      setShares(data);
    } catch (e) {
      setSharesError(e instanceof Error ? e.message : "Failed to load shares");
    } finally {
      setLoadingShares(false);
    }
  }, [currentDocumentId]);

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  async function handleAddShare(e: React.FormEvent) {
    e.preventDefault();
    if (!currentDocumentId || !email.trim()) return;

    setAdding(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      await shareDocument({ documentId: currentDocumentId, email: email.trim(), role });
      setEmail("");
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      await fetchShares();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to share");
    } finally {
      setAdding(false);
    }
  }

  async function handleRevoke(share: DocumentShare) {
    setRevokingId(share.id);
    try {
      await unshareDocument({ documentId: share.document_id, userId: share.user_id });
      setShares((prev) => prev.filter((s) => s.id !== share.id));
    } catch (err) {
      setSharesError(err instanceof Error ? err.message : "Failed to revoke");
    } finally {
      setRevokingId(null);
    }
  }

  if (!currentDocumentId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-slate-800">Share document</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Add share form */}
        <form onSubmit={handleAddShare} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as DocumentRole)}
              className="border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          {addError && <p className="text-xs text-red-600">{addError}</p>}
          {addSuccess && <p className="text-xs text-green-600">Access granted.</p>}

          <button
            type="submit"
            disabled={adding || !email.trim()}
            className="w-full py-2 rounded-lg bg-primary text-primary-content text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {adding ? "Adding…" : "Invite"}
          </button>
        </form>

        {/* Existing shares */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            People with access
          </p>
          {loadingShares ? (
            <div className="flex justify-center py-4">
              <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : sharesError ? (
            <p className="text-xs text-red-600">{sharesError}</p>
          ) : shares.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Not shared with anyone yet.</p>
          ) : (
            <ul className="space-y-2">
              {shares.map((share) => (
                <li
                  key={share.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 truncate">{share.display_name ?? share.user_id}</p>
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full mt-0.5
                        ${share.role === "editor"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {share.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRevoke(share)}
                    disabled={revokingId === share.id}
                    className="text-xs text-red-500 hover:text-red-700 shrink-0 disabled:opacity-40"
                  >
                    {revokingId === share.id ? "…" : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
