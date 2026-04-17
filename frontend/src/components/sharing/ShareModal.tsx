"use client";

/**
 * ShareModal — lets document owners share a document by selecting a user from
 * a searchable list (or falling back to email entry) and manage existing access.
 *
 * - User list fetched via `list_shareable_users` RPC (SECURITY DEFINER, bypasses RLS).
 * - Email resolution for sharing uses `find_user_by_email` RPC.
 * - Existing shares listed with role and revoke button.
 * - Only rendered when the user has `canShare` permission (enforced by caller).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppStore } from "@/src/store";
import {
  listSharesForDocument,
  shareDocument,
  unshareDocument,
  listShareableUsers,
} from "@/src/lib/db/documents";
import type { DocumentShare, DocumentRole } from "@/src/lib/db/types";

interface ShareModalProps {
  onClose: () => void;
}

interface ShareableUser {
  id: string;
  email: string;
  display_name: string | null;
}

export function ShareModal({ onClose }: ShareModalProps) {
  const currentDocumentId = useAppStore((s) => s.currentDocumentId);

  const [shares, setShares] = useState<DocumentShare[]>([]);
  const [loadingShares, setLoadingShares] = useState(true);
  const [sharesError, setSharesError] = useState<string | null>(null);

  // User list for picker
  const [users, setUsers] = useState<ShareableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ShareableUser | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add-share form state
  const [role, setRole] = useState<DocumentRole>("viewer");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // Revoke state
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Role change state
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

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

  useEffect(() => {
    listShareableUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sharedUserIds = new Set(shares.map((s) => s.user_id));

  const filteredUsers = users.filter((u) => {
    if (sharedUserIds.has(u.id)) return false; // already shared
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.display_name ?? "").toLowerCase().includes(q)
    );
  });

  function selectUser(u: ShareableUser) {
    setSelectedUser(u);
    setSearch(u.display_name ?? u.email);
    setDropdownOpen(false);
    setAddError(null);
  }

  function clearSelection() {
    setSelectedUser(null);
    setSearch("");
    setAddError(null);
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  async function handleAddShare(e: React.FormEvent) {
    e.preventDefault();
    if (!currentDocumentId || !selectedUser) return;

    setAdding(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      await shareDocument({
        documentId: currentDocumentId,
        email: selectedUser.email,
        role,
      });
      clearSelection();
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      await fetchShares();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to share");
    } finally {
      setAdding(false);
    }
  }

  async function handleRoleChange(share: DocumentShare, newRole: DocumentRole) {
    if (!currentDocumentId) return;
    setUpdatingRoleId(share.id);
    try {
      const userEmail = users.find((u) => u.id === share.user_id)?.email;
      if (!userEmail) throw new Error("Could not find user email");
      await shareDocument({ documentId: currentDocumentId, email: userEmail, role: newRole });
      setShares((prev) => prev.map((s) => s.id === share.id ? { ...s, role: newRole } : s));
    } catch (err) {
      setSharesError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setUpdatingRoleId(null);
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
          {/* User picker */}
          <div className="flex gap-2 items-start">
            <div className="flex-1 relative" ref={dropdownRef}>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
                {selectedUser && (
                  <div className="flex items-center gap-1.5 pl-3 py-2 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center uppercase">
                      {(selectedUser.display_name ?? selectedUser.email)[0]}
                    </span>
                  </div>
                )}
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedUser(null);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder={usersLoading ? "Loading users…" : "Search by name or email…"}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-transparent min-w-0"
                  autoComplete="off"
                />
                {selectedUser && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="pr-3 text-slate-400 hover:text-slate-600 text-sm"
                    tabIndex={-1}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {dropdownOpen && !usersLoading && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-slate-400 italic">
                      {search ? "No users match your search." : "No users available to share with."}
                    </p>
                  ) : (
                    filteredUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); selectUser(u); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors"
                      >
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center uppercase shrink-0">
                          {(u.display_name ?? u.email)[0]}
                        </span>
                        <div className="min-w-0">
                          {u.display_name && (
                            <p className="text-sm font-semibold text-slate-800 truncate">{u.display_name}</p>
                          )}
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as DocumentRole)}
              className="border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white shrink-0"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          {addError && <p className="text-xs text-red-600">{addError}</p>}
          {addSuccess && <p className="text-xs text-green-600">Access granted.</p>}

          <button
            type="submit"
            disabled={adding || !selectedUser}
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
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center uppercase shrink-0">
                      {(share.display_name ?? share.user_id)[0]}
                    </span>
                    <p className="text-xs text-slate-700 truncate font-medium">{share.display_name ?? share.user_id}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={share.role}
                      onChange={(e) => handleRoleChange(share, e.target.value as DocumentRole)}
                      disabled={updatingRoleId === share.id}
                      className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white disabled:opacity-50"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRevoke(share)}
                      disabled={revokingId === share.id}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                    >
                      {revokingId === share.id ? "…" : "Remove"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
