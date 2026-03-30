"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import {
  getAdminUsers,
  blockUser,
  unblockUser,
  type AdminUser,
} from "@/services/admin";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  BLOCKED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers(page, 10);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      setActionLoadingId(user.id);

      const res =
        user.status === "ACTIVE"
          ? await blockUser(user.id)
          : await unblockUser(user.id);

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
              : u
          )
        );
      } else {
        alert(res.message || "Action failed");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
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
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            placeholder="Search users..."
            className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-36"
          />
        </div>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No users found</div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {getInitials(u.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  u.role === "TUTOR"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {u.role}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[u.status]}`}
              >
                {u.status}
              </span>

              <button
                onClick={() => handleToggleStatus(u)}
                disabled={actionLoadingId === u.id}
                className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition disabled:opacity-50"
              >
                {actionLoadingId === u.id
                  ? "Processing..."
                  : u.status === "ACTIVE"
                  ? "Block"
                  : "Unblock"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">Page {page}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg border border-border text-xs font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}