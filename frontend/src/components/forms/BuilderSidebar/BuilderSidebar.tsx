"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/src/store";
import { DocumentForm } from "../DocumentForm/DocumentForm";
import type { BuilderSidebarProps } from "./types";
import { UserMenu } from "@/src/components/auth/UserMenu";
import { SaveButton } from "@/src/components/documents/SaveButton";
import { MyDocumentsPanel } from "@/src/components/documents/MyDocumentsPanel";
import { ShareModal } from "@/src/components/sharing/ShareModal";
import { RequestAccessButton } from "@/src/components/sharing/RequestAccessButton";
import { usePermissions } from "@/src/lib/permissions";
import { getMyRole, getMyProfile, listPendingRequests } from "@/src/lib/db/documents";

export const BuilderSidebar = ({ className = "" }: BuilderSidebarProps) => {
    const [docsOpen, setDocsOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [pendingRequestCount, setPendingRequestCount] = useState(0);
    const user = useAppStore((s) => s.user);
    const setUser = useAppStore((s) => s.setUser);
    const currentDocumentId = useAppStore((s) => s.currentDocumentId);
    const setCurrentDocumentRole = useAppStore((s) => s.setCurrentDocumentRole);
    const { canShare, canDelete, role } = usePermissions();

    // When a document loads, resolve the role and store it.
    // Also enrich the user profile with app_role (for admin checks).
    useEffect(() => {
        if (!currentDocumentId || !user) {
            setCurrentDocumentRole(null);
            return;
        }

        getMyRole(currentDocumentId)
            .then((r) => setCurrentDocumentRole(r ?? null))
            .catch(() => setCurrentDocumentRole(null));
    }, [currentDocumentId, user, setCurrentDocumentRole]);

    // Fetch app_role once the user signs in (needed by usePermissions admin check).
    useEffect(() => {
        if (!user || user.app_role) return;
        getMyProfile()
            .then((profile) => {
                if (profile && user) {
                    setUser({ ...user, app_role: profile.app_role });
                }
            })
            .catch(() => {/* non-fatal */});
    }, [user, setUser]);

    // Poll pending access requests count so the Share button badge stays current.
    useEffect(() => {
        if (!currentDocumentId || !canShare) {
            setPendingRequestCount(0);
            return;
        }
        let cancelled = false;
        function refresh() {
            if (!currentDocumentId) return;
            listPendingRequests(currentDocumentId)
                .then((reqs) => { if (!cancelled) setPendingRequestCount(reqs.length); })
                .catch(() => { if (!cancelled) setPendingRequestCount(0); });
        }
        refresh();
        const interval = setInterval(refresh, 30_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, [currentDocumentId, canShare]);

    // Role badge config
    const roleBadge = (() => {
        if (!currentDocumentId || !role) return null;
        const map = {
            owner: { label: "Owner", cls: "bg-slate-900 text-white" },
            editor: { label: "Editor", cls: "bg-blue-100 text-blue-700" },
            viewer: { label: "Viewing", cls: "bg-amber-100 text-amber-700" },
        };
        return map[role] ?? null;
    })();

    return (
        <div className={`w-full h-full p-6 lg:p-10 ${className}`}>
            {/* ── Top header ─────────────────────────────────────── */}
            <div className="mb-10 flex justify-between items-center gap-3">
                {/* Logo + version + role badge */}
                <div className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo-main-genbuzz.png"
                        alt="GenBuzz"
                        className="h-9"
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            v1.0 • Phase 3
                        </p>
                        {roleBadge && (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${roleBadge.cls}`}>
                                {roleBadge.label}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side: cloud controls */}
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* My Documents button — only visible when signed in */}
                    {user && (
                        <button
                            onClick={() => setDocsOpen(true)}
                            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                            </svg>
                            My Docs
                        </button>
                    )}

                    {/* Share button — only when user can share this doc */}
                    {canShare && (
                        <button
                            onClick={() => setShareOpen(true)}
                            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 relative"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                            {pendingRequestCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                                    {pendingRequestCount}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Request editor access — only visible to viewers */}
                    {role === "viewer" && <RequestAccessButton />}

                    {/* Delete button — only owner/admin on a loaded doc */}
                    {canDelete && currentDocumentId && (
                        <div className="hidden lg:block">
                            <DeleteDocButton documentId={currentDocumentId} />
                        </div>
                    )}

                    {/* Save button — desktop only */}
                    <div className="hidden lg:block">
                        <SaveButton />
                    </div>

                    {/* User menu — desktop only */}
                    <div className="hidden lg:block">
                        <UserMenu />
                    </div>
                </div>
            </div>

            {/* ── Main form ──────────────────────────────────────── */}
            <DocumentForm />

            {/* ── My Documents slide-over ────────────────────────── */}
            <MyDocumentsPanel isOpen={docsOpen} onClose={() => setDocsOpen(false)} />

            {/* ── Share modal ────────────────────────────────────── */}
            {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
        </div>
    );
};

// ── Inline delete button ─────────────────────────────────────────────────────
import { deleteDocument } from "@/src/lib/db/documents";

function DeleteDocButton({ documentId }: { documentId: string }) {
    const [deleting, setDeleting] = useState(false);
    const newDocument = useAppStore((s) => s.newDocument);

    async function handleDelete() {
        if (!confirm("Delete this document? This cannot be undone.")) return;
        setDeleting(true);
        try {
            await deleteDocument(documentId);
            newDocument();
        } catch (e) {
            alert(e instanceof Error ? e.message : "Delete failed");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50"
        >
            {deleting ? (
                <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
            ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
            Delete
        </button>
    );
}
