"use client";

/**
 * AccessRequestToast — polls for pending access requests and shows a popup
 * notification for each one. Only visible to document owners and global admins.
 *
 * Rendered once at the app level (BuilderSidebar). Each toast represents one
 * pending request and has Approve / Deny actions inline.
 */

import { useState, useEffect, useCallback } from "react";
import { listAllPendingRequests, reviewAccessRequest } from "@/src/lib/db/documents";
import type { PendingAccessRequestWithDoc } from "@/src/lib/db/types";

const POLL_INTERVAL = 20_000;

export function AccessRequestToast() {
  const [queue, setQueue] = useState<PendingAccessRequestWithDoc[]>([]);
  // IDs the user has already dismissed locally (so they don't reappear until next poll)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await listAllPendingRequests();
      setQueue(data);
    } catch {
      // Non-owners / unauthenticated — silently ignore
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  async function handleReview(req: PendingAccessRequestWithDoc, status: "approved" | "denied") {
    setReviewingId(req.id);
    try {
      await reviewAccessRequest({ requestId: req.id, status });
      setQueue((prev) => prev.filter((r) => r.id !== req.id));
    } catch {
      // If it fails just dismiss visually — they'll see it in the panel
      dismiss(req.id);
    } finally {
      setReviewingId(null);
    }
  }

  function dismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]));
  }

  const visible = queue.filter((r) => !dismissed.has(r.id));
  if (visible.length === 0) return null;

  // Show at most 3 toasts stacked; rest are visible in the panel
  const shown = visible.slice(0, 3);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-3 items-end">
      {shown.map((req, i) => (
        <div
          key={req.id}
          style={{ opacity: 1 - i * 0.08 }}
          className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center uppercase shrink-0">
                {req.display_name[0]}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{req.display_name}</p>
                <p className="text-[10px] text-slate-500 truncate">{req.email}</p>
              </div>
            </div>
            <button
              onClick={() => dismiss(req.id)}
              className="text-slate-400 hover:text-slate-600 shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div>
            <p className="text-xs text-slate-600">
              Requesting <span className="font-semibold text-slate-800">editor</span> access to{" "}
              <span className="font-semibold text-slate-800 truncate">{req.document_title}</span>
            </p>
            {req.message && (
              <p className="text-[11px] text-slate-500 italic mt-1">"{req.message}"</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleReview(req, "approved")}
              disabled={reviewingId === req.id}
              className="flex-1 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {reviewingId === req.id ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </span>
              ) : "Approve"}
            </button>
            <button
              onClick={() => handleReview(req, "denied")}
              disabled={reviewingId === req.id}
              className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Deny
            </button>
          </div>
        </div>
      ))}

      {/* Overflow indicator */}
      {visible.length > 3 && (
        <p className="text-[10px] text-slate-500 pr-1">
          +{visible.length - 3} more in My Docs
        </p>
      )}
    </div>
  );
}
