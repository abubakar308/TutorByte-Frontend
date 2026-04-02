"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users, Search, Trash2, Calendar, Mail,
  ShieldAlert, ShieldCheck, Loader2, X,
} from "lucide-react";
import Image from "next/image";
import {
  getAdminUsers,
  changeUserStatus,
  deleteUser,
  type AdminUser,
} from "@/services/admin";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  BLOCKED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPage: 1, total: 0 });

  // fetchUsers এখন ফিক্সডভাবে "STUDENT" রোল পাঠাবে
  const fetchUsers = useCallback(async (targetPage: number, targetSearch: string) => {
    setLoading(true);
    try {
      // Role parameter is hardcoded to "STUDENT"
      const res = await getAdminUsers(targetPage, 10, targetSearch, "STUDENT");

      if (res.success && res.data) {
        const raw = res.data as any;
        const list: AdminUser[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        const pageMeta = raw?.meta ?? { totalPage: 1, total: list.length };

        setUsers(list);
        setMeta({ 
            totalPage: pageMeta.totalPage ?? 1, 
            total: pageMeta.total ?? list.length 
        });
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(page, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page, fetchUsers]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); 
  };

  const handleToggleStatus = async (user: AdminUser) => {
    setActionLoadingId(user.id);
    try {
      const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
      const res = await changeUserStatus(user.id, nextStatus);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch {
      alert("Status update failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Delete student "${user.name}"?`)) return;
    setActionLoadingId(user.id);
    try {
      const res = await deleteUser(user.id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setMeta((m) => ({ ...m, total: m.total - 1 }));
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-bold flex items-center gap-2 text-lg text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Student Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loading ? "Updating..." : `Total ${meta.total} students found`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search students..."
              className="w-full md:w-64 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground/60"
            />
            {search && (
              <button onClick={() => handleSearchChange("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table headers */}
      <div className="hidden md:grid grid-cols-[2fr_1.2fr_1fr_1.2fr_80px] gap-4 border-b border-border bg-muted/20 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <p>Student Name</p>
        <p>Joined Date</p>
        <p>Account Status</p>
        <p className="text-center">Manage Access</p>
        <p className="text-center">Action</p>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {loading && users.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
              <div className="h-11 w-11 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2"><div className="h-4 w-32 bg-muted rounded" /><div className="h-3 w-48 bg-muted rounded" /></div>
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No students found.</p>
          </div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="grid grid-cols-1 gap-3 px-6 py-4 transition hover:bg-muted/30 md:grid-cols-[2fr_1.2fr_1fr_1.2fr_80px] md:items-center md:gap-4">
              
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center border border-border">
                  {u.image ? (
                    <Image src={u.image} alt={u.name} fill className="object-cover" sizes="44px" />
                  ) : (
                    <span className="text-sm font-bold text-primary">{getInitials(u.name)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {u.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </div>

              <div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${STATUS_STYLES[u.status]}`}>
                  {u.status}
                </span>
              </div>

              <div className="flex md:justify-center">
                <button
                  onClick={() => handleToggleStatus(u)}
                  disabled={actionLoadingId === u.id}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                    u.status === "ACTIVE"
                      ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                      : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  } disabled:opacity-40`}
                >
                  {actionLoadingId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : u.status === "ACTIVE" ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  {u.status === "ACTIVE" ? "Block Student" : "Unblock Student"}
                </button>
              </div>

              <div className="flex md:justify-center">
                <button
                  onClick={() => handleDeleteUser(u)}
                  disabled={actionLoadingId === u.id}
                  className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border bg-muted/10 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Page <span className="font-bold text-foreground">{page}</span> of {meta.totalPage}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
            disabled={page >= meta.totalPage || loading}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}