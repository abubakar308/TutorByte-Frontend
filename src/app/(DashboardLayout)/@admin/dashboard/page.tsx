"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, MessageSquare, CreditCard, User,
  LogOut, Bell, Star, Clock, ChevronRight, BookOpen, TrendingUp,
  Users, DollarSign, CheckCircle, XCircle, Menu, X, Plus, BarChart3,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  REJECTED:  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const mockStats = [
  { label: "Total Earnings",    value: "$2,840", icon: DollarSign,  change: "+$320 this month", positive: true },
  { label: "Total Sessions",    value: "64",     icon: BookOpen,    change: "+8 this month",    positive: true },
  { label: "Avg. Rating",       value: "4.9★",   icon: Star,        change: "From 48 reviews",  positive: null },
  { label: "Active Students",   value: "18",     icon: Users,       change: "+3 this month",    positive: true },
];

const mockBookings = [
  { id: "1", student: "Alex Johnson",  subject: "Mathematics", date: "Aug 12", time: "10:00–11:00", status: "PENDING",   amount: 45, initials: "AJ" },
  { id: "2", student: "Maria Garcia",  subject: "Mathematics", date: "Aug 10", time: "14:00–15:00", status: "ACCEPTED",  amount: 45, initials: "MG" },
  { id: "3", student: "Tom Wilson",    subject: "Calculus",    date: "Aug 08", time: "09:00–10:00", status: "COMPLETED", amount: 45, initials: "TW" },
  { id: "4", student: "Sarah Kim",     subject: "Statistics",  date: "Aug 07", time: "16:00–17:00", status: "COMPLETED", amount: 45, initials: "SK" },
];

const recentReviews = [
  { student: "Maria Garcia", rating: 5, comment: "Excellent explanation of calculus concepts. Very patient!", initials: "MG", date: "Aug 8" },
  { student: "Tom Wilson",   rating: 5, comment: "Best math tutor I've ever had. Highly recommend!", initials: "TW", date: "Aug 5" },
  { student: "Alex J.",      rating: 4, comment: "Very helpful. Would book again.", initials: "AJ", date: "Aug 2" },
];

const navItems = [
  { id: "dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { id: "bookings",     icon: Calendar,        label: "Bookings" },
  { id: "availability", icon: Clock,           label: "Availability" },
  { id: "earnings",     icon: DollarSign,      label: "Earnings" },
  { id: "messages",     icon: MessageSquare,   label: "Messages" },
  { id: "profile",      icon: User,            label: "My Profile" },
];

export default function TutorDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);

  const pending = mockBookings.filter(b => b.status === "PENDING");

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          {sideOpen && <span className="ml-3 text-[15px] font-bold whitespace-nowrap">TutorByte</span>}
        </div>

        {/* Tutor badge */}
        {sideOpen && (
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">SC</div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">Sarah Chen</p>
                <p className="text-[11px] text-primary font-medium">Tutor · Approved ✓</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {sideOpen && <span className="whitespace-nowrap">{label}</span>}
              {sideOpen && id === "bookings" && pending.length > 0 && (
                <span className="ml-auto rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition">
            <LogOut className="h-4 w-4 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(o => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              {sideOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[15px] font-bold">Tutor Dashboard</p>
              <p className="text-xs text-muted-foreground">Manage your sessions and earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pending.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                {pending.length} pending request{pending.length > 1 ? "s" : ""}
              </div>
            )}
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              {pending.length > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
            {mockStats.map(({ label, value, icon: Icon, change, positive }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                <p className={`text-xs font-semibold mt-2 ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{change}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Bookings table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold">Booking Requests</h2>
                <span className="text-xs text-muted-foreground">{mockBookings.length} total</span>
              </div>

              <div className="divide-y divide-border">
                {mockBookings.map(b => (
                  <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      {b.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{b.student}</p>
                      <p className="text-xs text-muted-foreground">{b.subject} · {b.date} · {b.time}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold shrink-0 ${STATUS_STYLES[b.status]}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                    <p className="font-bold text-sm shrink-0">${b.amount}</p>

                    {b.status === "PENDING" && (
                      <div className="flex gap-2 shrink-0">
                        <button className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 text-xs font-bold hover:opacity-80 transition">
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-3 py-1.5 text-xs font-bold hover:opacity-80 transition">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    )}

                    {b.status === "ACCEPTED" && (
                      <button className="shrink-0 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/20 transition">
                        Add link
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              {/* Earnings chart (simplified) */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">This Month</h3>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-black text-foreground">$320</p>
                <p className="text-xs text-muted-foreground mb-4">8 sessions completed</p>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-16">
                  {[40,65,30,80,55,90,70,45].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {["W1","W2","W3","W4","W5","W6","W7","W8"].map(w => (
                    <span key={w} className="text-[10px] text-muted-foreground">{w}</span>
                  ))}
                </div>
              </div>

              {/* Recent reviews */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-sm">Recent Reviews</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black">4.9</span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {recentReviews.map(r => (
                    <div key={r.student} className="px-5 py-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center">{r.initials}</div>
                          <p className="text-sm font-semibold">{r.student}</p>
                        </div>
                        <div className="flex">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-9">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
