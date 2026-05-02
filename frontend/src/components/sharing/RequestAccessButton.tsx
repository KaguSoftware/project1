"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/src/store";
import { requestEditorAccess, getMyRequestStatus } from "@/src/lib/db/documents";
import type { AccessRequest } from "@/src/lib/db/types";

export function RequestAccessButton() {
  const currentDocumentId = useAppStore((s) => s.currentDocumentId);
  const [request, setRequest] = useState<AccessRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentDocumentId) return;
    setLoading(true);
    getMyRequestStatus(currentDocumentId)
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [currentDocumentId]);

  async function handleRequest() {
    if (!currentDocumentId) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await requestEditorAccess({ documentId: currentDocumentId });
      setRequest(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !currentDocumentId) return null;

  // Already approved — no button needed (role will have changed)
  if (request?.status === "approved") return null;

  if (request?.status === "pending") {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Access requested
      </div>
    );
  }

  if (request?.status === "denied") {
    return (
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-xs text-slate-400">Request denied</span>
        <button
          onClick={handleRequest}
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 disabled:opacity-50"
        >
          {submitting ? (
            <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          )}
          Request again
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  // No request yet
  return (
    <div className="hidden lg:flex items-center gap-2">
      <button
        onClick={handleRequest}
        disabled={submitting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 disabled:opacity-50"
      >
        {submitting ? (
          <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        )}
        Request editor access
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
