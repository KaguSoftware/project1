"use client";

/**
 * AdminPanel — interactive admin dashboard.
 *
 * Mounted only after the server page has verified admin access.
 * Displays:
 *  - All users with role dropdowns (calls admin_set_user_role RPC)
 *  - All documents with owner info
 *
 * All Supabase calls here go through the browser client with the user's JWT.
 * The server-side check in /admin/page.tsx is the real security gate.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminListUsers,
  adminListDocuments,
  adminSetUserRole,
} from "@/src/lib/db/documents";
import type { ProfileRow, DocumentWithOwner } from "@/src/lib/db/types";

type RoleOption = "admin" | "member" | "client";

export function AdminPanel() {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [documents, setDocuments] = useState<DocumentWithOwner[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "documents">("users");

  useEffect(() => {
    adminListUsers()
      .then(setUsers)
      .catch((e) => setUsersError(e instanceof Error ? e.message : "Failed to load users"))
      .finally(() => setLoadingUsers(false));

    adminListDocuments()
      .then(setDocuments)
      .catch((e) => setDocsError(e instanceof Error ? e.message : "Failed to load documents"))
      .finally(() => setLoadingDocs(false));
  }, []);

  async function handleRoleChange(userId: string, role: RoleOption) {
    setUpdatingRole(userId);
    setRoleError(null);
    try {
      await adminSetUserRole({ userId, role });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, app_role: role } : u))
      );
    } catch (e) {
      setRoleError(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage users and documents across the platform.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back to app
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6 border border-slate-200">
          {(["users", "documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Users tab ────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                All Users ({users.length})
              </p>
            </div>
            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : usersError ? (
              <p className="text-xs text-red-600 px-6 py-4">{usersError}</p>
            ) : (
              <>
                {roleError && (
                  <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700">{roleError}</p>
                  </div>
                )}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                      <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Name</th>
                      <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                      <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-xs text-slate-700 truncate max-w-[180px]">{user.email}</td>
                        <td className="px-6 py-3 text-xs text-slate-500 hidden sm:table-cell">{user.display_name ?? "—"}</td>
                        <td className="px-6 py-3">
                          <select
                            value={user.app_role}
                            disabled={updatingRole === user.id}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value as RoleOption)
                            }
                            className={`text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white
                              ${user.app_role === "admin" ? "border-amber-300 text-amber-700" :
                                user.app_role === "client" ? "border-blue-200 text-blue-700" :
                                "border-slate-200 text-slate-700"}
                              ${updatingRole === user.id ? "opacity-50" : ""}
                            `}
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                          </select>
                          {updatingRole === user.id && (
                            <span className="ml-2 w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block align-middle" />
                          )}
                        </td>
                        <td className="px-6 py-3 text-xs text-slate-400 hidden md:table-cell">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* ── Documents tab ─────────────────────────────────────── */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                All Documents ({documents.length})
              </p>
            </div>
            {loadingDocs ? (
              <div className="flex justify-center py-12">
                <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : docsError ? (
              <p className="text-xs text-red-600 px-6 py-4">{docsError}</p>
            ) : documents.length === 0 ? (
              <p className="text-xs text-slate-400 px-6 py-4 italic">No documents yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Title</th>
                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Type</th>
                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Owner</th>
                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-xs text-slate-700 font-medium truncate max-w-[180px]">{doc.title}</td>
                      <td className="px-6 py-3 text-xs text-slate-400 capitalize hidden sm:table-cell">
                        {doc.doc_type.replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-500 truncate max-w-[150px]">
                        {doc.owner_email ?? doc.owner_id}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-400 hidden md:table-cell">
                        {formatDate(doc.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
