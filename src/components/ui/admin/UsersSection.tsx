"use client";

import { useEffect, useState } from "react";
import { Users, Search, Trash2 } from "lucide-react";
import {
  getAdminUsers,
  changeUserStatus,
  deleteUser,
  type AdminUser,
} from "@/services/admin";

const STATUS_STYLES: Record<AdminUser["status"], string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  BLOCKED:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const ROLE_STYLES: Record<AdminUser["role"], string> = {
  TUTOR: "bg-primary/10 text-primary",
  ADMIN:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  STUDENT: "bg-secondary/10 text-secondary",
};

export default function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = async (targetPage = page, targetSearch = search) => {
    try {
      setLoading(true);

      const res = await getAdminUsers(targetPage, 10, targetSearch);

      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  const handleSearch = async () => {
    setPage(1);
    await fetchUsers(1, search);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const previousUsers = users;
   

    try {
      setActionLoadingId(user.status);

      const nextStatus: AdminUser["status"] =
        user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: nextStatus,
              }
            : u
        )
      );

      await changeUserStatus(user.id, nextStatus);

    } catch (error) {
      console.error("Failed to update user status:", error);
      setUsers(previousUsers);
      alert("Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoadingId(user.id);

      // Optimistically remove from UI
      setUsers((prev) => prev.filter((u) => u.id !== user.id));

      const res = await deleteUser(user.id);

      if (!res.success) {
        // Revert on failure
        await fetchUsers(page, search);
        alert(res.message || "Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Revert on error
      await fetchUsers(page, search);
      alert("Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="font-bold flex items-center gap-2">
          <Users className="h-4 w-4" /> Users
        </h2>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search users..."
            className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Column header */}
      <div className="hidden md:grid grid-cols-[1.8fr_1fr_1fr_120px_80px] gap-4 border-b border-border bg-muted/20 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <p>User</p>
        <p>Role</p>
        <p>Status</p>
        <p className="text-right">Action</p>
        <p className="text-center">Delete</p>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No users found
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-1 gap-3 px-6 py-4 transition hover:bg-muted/40 md:grid-cols-[1.8fr_1fr_1fr_120px_80px] md:items-center md:gap-4"
            >
              {/* User */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {getInitials(u.name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center md:block">
                <span className="mr-2 text-xs text-muted-foreground md:hidden">
                  Role:
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${ROLE_STYLES[u.role]}`}
                >
                  {u.role}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center md:block">
                <span className="mr-2 text-xs text-muted-foreground md:hidden">
                  Status:
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[u.status]}`}
                >
                  {u.status}
                </span>
              </div>

              {/* Action */}
              <div className="flex md:justify-end gap-2">
                {u.role !== "ADMIN" ? (
                  <button
                    onClick={() => handleToggleStatus(u)}
                    disabled={actionLoadingId === u.id}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionLoadingId === u.id
                      ? "Processing..."
                      : u.status === "ACTIVE"
                      ? "Block"
                      : "Unblock"}
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>

              {/* Delete */}
              <div className="flex md:justify-center">
                {u.role !== "ADMIN" ? (
                  <button
                    onClick={() => handleDeleteUser(u)}
                    disabled={actionLoadingId === u.id}
                    className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
        <p className="text-xs text-muted-foreground">Page {page}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
            className="rounded-lg border border-border px-3 py-1 text-xs font-semibold disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="rounded-lg border border-border px-3 py-1 text-xs font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}