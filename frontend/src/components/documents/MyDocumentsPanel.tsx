"use client";

/**
 * MyDocumentsPanel — slide-over panel listing the user's saved documents.
 *
 * Two sections:
 *  1. My Documents — docs the user owns (delete button available)
 *  2. Shared with me — docs shared by others (role badge, no delete)
 *
 * Clicking any row loads the full document + resolves the role into the store.
 */

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/src/store";
import {
  listMyDocuments,
  listSharedWithMe,
  loadDocument,
  deleteDocument,
  getMyRole,
} from "@/src/lib/db/documents";
import type { SavedDocumentMeta } from "@/src/lib/db/types";
import type { DocumentData } from "@/src/store/types";

interface MyDocumentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyDocumentsPanel({ isOpen, onClose }: MyDocumentsPanelProps) {
  const user = useAppStore((s) => s.user);
  const savedDocuments = useAppStore((s) => s.savedDocuments);
  const setSavedDocuments = useAppStore((s) => s.setSavedDocuments);
  const isLoadingDocs = useAppStore((s) => s.isLoadingDocs);
  const setIsLoadingDocs = useAppStore((s) => s.setIsLoadingDocs);
  const loadDocumentIntoStore = useAppStore((s) => s.loadDocument);
  const setCurrentDocumentRole = useAppStore((s) => s.setCurrentDocumentRole);
  const currentDocumentId = useAppStore((s) => s.currentDocumentId);

  const [sharedDocs, setSharedDocs] = useState<SavedDocumentMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setIsLoadingDocs(true);
    setError(null);
    try {
      const [mine, shared] = await Promise.all([
        listMyDocuments(),
        listSharedWithMe(),
      ]);
      setSavedDocuments(mine);
      setSharedDocs(shared);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load documents");
    } finally {
      setIsLoadingDocs(false);
    }
  }, [user, setSavedDocuments, setIsLoadingDocs]);

  // Fetch list whenever panel opens (and user is logged in)
  useEffect(() => {
    if (!isOpen || !user) return;
    fetchAll();
  }, [isOpen, user, fetchAll]);

  async function handleLoad(meta: SavedDocumentMeta, knownRole?: "editor" | "viewer") {
    setLoadingId(meta.id);
    try {
      const saved = await loadDocument(meta.id);
      const content = saved.content as {
        document?: DocumentData;
        language?: "en" | "ar" | "tr";
        hiddenFields?: string[];
      };
      loadDocumentIntoStore({
        id: saved.id,
        document: content.document ?? (saved.content as unknown as DocumentData),
        language: content.language ?? "en",
        hiddenFields: content.hiddenFields ?? [],
      });

      // Resolve role immediately so the UI reflects it before the sidebar effect fires
      if (knownRole) {
        setCurrentDocumentRole(knownRole);
      } else {
        // Owner — resolve via RPC to be certain
        const r = await getMyRole(saved.id);
        setCurrentDocumentRole(r ?? null);
      }

      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load document");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setSavedDocuments(savedDocuments.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-80 z-50 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800">My Documents</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!user ? (
            <p className="text-xs text-slate-500 text-center mt-8">Sign in to see your saved documents.</p>
          ) : isLoadingDocs ? (
            <div className="flex items-center justify-center mt-12">
              <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-xs text-red-600 text-center mt-8">{error}</p>
          ) : (
            <>
              {/* ── My Documents ─────────────────────────────── */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  My Documents
                </p>
                {savedDocuments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No saved documents yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {savedDocuments.map((doc) => (
                      <DocRow
                        key={doc.id}
                        doc={doc}
                        isCurrent={doc.id === currentDocumentId}
                        isLoading={loadingId === doc.id}
                        isDeleting={deletingId === doc.id}
                        onLoad={() => handleLoad(doc)}
                        onDelete={(e) => handleDelete(doc.id, e)}
                        showDelete
                        formatDate={formatDate}
                      />
                    ))}
                  </ul>
                )}
              </section>

              {/* ── Shared with me ────────────────────────────── */}
              {sharedDocs.length > 0 && (
                <section>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Shared with me
                  </p>
                  <ul className="space-y-2">
                    {sharedDocs.map((doc) => (
                      <DocRow
                        key={doc.id}
                        doc={doc}
                        isCurrent={doc.id === currentDocumentId}
                        isLoading={loadingId === doc.id}
                        isDeleting={false}
                        onLoad={() => handleLoad(doc, doc.shared_role)}
                        onDelete={() => {}}
                        showDelete={false}
                        formatDate={formatDate}
                        sharedRole={doc.shared_role}
                      />
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── DocRow sub-component ─────────────────────────────────────────────────────

interface DocRowProps {
  doc: SavedDocumentMeta;
  isCurrent: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  onLoad: () => void;
  onDelete: (e: React.MouseEvent) => void;
  showDelete: boolean;
  formatDate: (iso: string) => string;
  sharedRole?: "editor" | "viewer";
}

function DocRow({
  doc, isCurrent, isLoading, isDeleting,
  onLoad, onDelete, showDelete, formatDate, sharedRole,
}: DocRowProps) {
  return (
    <li
      onClick={onLoad}
      className={`group flex items-start justify-between gap-2 p-3 rounded-xl border cursor-pointer transition-all
        ${isCurrent
          ? "border-primary/40 bg-primary/5"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-800 truncate">{doc.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <p className="text-[10px] text-slate-400 capitalize">
            {doc.doc_type.replace(/_/g, " ")} · {formatDate(doc.updated_at)}
          </p>
          {sharedRole && (
            <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full
              ${sharedRole === "editor"
                ? "bg-blue-100 text-blue-700"
                : "bg-amber-100 text-amber-700"
              }`}
            >
              {sharedRole}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isLoading && (
          <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        )}
        {showDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all disabled:opacity-30"
            aria-label="Delete document"
          >
            {isDeleting ? (
              <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        )}
      </div>
    </li>
  );
}
