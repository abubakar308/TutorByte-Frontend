"use client";
import { useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, CreditCard, ShieldCheck,
  LogOut, Bell, Star, TrendingUp, AlertTriangle, CheckCircle,
  XCircle, Menu, X, Search, Filter, BarChart3, DollarSign,
  UserCheck, Activity,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  APPROVED:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED:  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  ACTIVE:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  BLOCKED:   "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  PAID:      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REFUNDED:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const platformStats = [
  { label: "Total Revenue",    value: "$48,320", icon: DollarSign,  change: "+12% vs last month", positive: true },
  { label: "Total Users",      value: "1,284",   icon: Users,       change: "+48 this week",      positive: true },
  { label: "Active Sessions",  value: "342",     icon: Activity,    change: "Live right now",      positive: null },
  { label: "Pending Approvals",value: "7",       icon: ShieldCheck, change: "Tutors awaiting",     positive: null },
];

const pendingTutors = [
  { id: "1", name: "Carlos Vega",    subject: "Chemistry", exp: "5 yrs", joined: "Aug 10", initials: "CV", rating: null },
  { id: "2", name: "Yuki Tanaka",    subject: "Python",    exp: "8 yrs", joined: "Aug 09", initials: "YT", rating: null },
  { id: "3", name: "Fatima Al-Amin", subject: "Biology",   exp: "3 yrs", joined: "Aug 08", initials: "FA", rating: null },
];

const recentUsers = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com", role: "STUDENT", status: "ACTIVE",  joined: "Aug 12", initials: "AJ" },
  { id: "2", name: "Sarah Chen",   email: "sarah@example.com", role: "TUTOR",  status: "ACTIVE",  joined: "Aug 11", initials: "SC" },
  { id: "3", name: "Tom Wilson",   email: "tom@example.com",   role: "STUDENT", status: "BLOCKED", joined: "Aug 10", initials: "TW" },
  { id: "4", name: "Maria Garcia", email: "maria@example.com", role: "STUDENT", status: "ACTIVE",  joined: "Aug 09", initials: "MG" },
];

const recentPayments = [
  { id: "P1", student: "Alex J.",   tutor: "Sarah C.",   amount: 45, gateway: "STRIPE",     status: "PAID",     date: "Aug 12" },
  { id: "P2", student: "Maria G.",  tutor: "James O.",   amount: 38, gateway: "SSLCOMMERZ", status: "PAID",     date: "Aug 10" },
  { id: "P3", student: "Tom W.",    tutor: "Priya S.",   amount: 52, gateway: "STRIPE",     status: "REFUNDED", date: "Aug 08" },
  { id: "P4", student: "Sarah K.",  tutor: "Marco R.",   amount: 35, gateway: "SSLCOMMERZ", status: "PAID",     date: "Aug 07" },
];

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "users",     icon: Users,           label: "Users" },
  { id: "tutors",    icon: UserCheck,       label: "Tutors",         badge: 7 },
  { id: "bookings",  icon: BookOpen,        label: "Bookings" },
  { id: "payments",  icon: CreditCard,      label: "Payments" },
  { id: "reports",   icon: AlertTriangle,   label: "Reports" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          {sideOpen && <span className="ml-3 text-[15px] font-bold whitespace-nowrap">TutorByte Admin</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, icon: Icon, label, badge }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {sideOpen && <span className="whitespace-nowrap flex-1 text-left">{label}</span>}
              {sideOpen && badge && badge > 0 && (
                <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5">{badge}</span>
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
              <p className="text-[15px] font-bold">Platform Overview</p>
              <p className="text-xs text-muted-foreground">Manage everything from here</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              7 pending tutor approvals
            </div>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
            {platformStats.map(({ label, value, icon: Icon, change, positive }) => (
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

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              {/* Pending tutor approvals */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold">Pending Tutor Approvals</h2>
                    <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5">{pendingTutors.length}</span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {pendingTutors.map(t => (
                    <div key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                        {t.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.subject} · {t.exp} experience · Applied {t.joined}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 text-xs font-bold hover:opacity-80 transition">
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-3 py-1.5 text-xs font-bold hover:opacity-80 transition">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent users */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="font-bold">Recent Users</h2>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search users..." className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-36" />
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {recentUsers.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                    <div key={u.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {u.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${u.role === "TUTOR" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                        {u.role}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[u.status]}`}>
                        {u.status}
                      </span>
                      <div className="flex gap-2 shrink-0">
                        {u.status === "ACTIVE" ? (
                          <button className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition">Block</button>
                        ) : (
                          <button className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition">Unblock</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              {/* Revenue breakdown */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm">Revenue (30 days)</h3>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-black mb-1">$5,840</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-5">+12% vs last month</p>
                <div className="space-y-3">
                  {[
                    { label: "Platform fees (10%)", value: "$584",   pct: 10, color: "bg-primary" },
                    { label: "Tutor payouts (90%)", value: "$5,256", pct: 90, color: "bg-primary/30" },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-bold">{r.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${r.color} transition-all`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent payments */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-bold text-sm">Recent Payments</h3>
                </div>
                <div className="divide-y divide-border">
                  {recentPayments.map(p => (
                    <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{p.student} → {p.tutor}</p>
                        <p className="text-xs text-muted-foreground">{p.gateway} · {p.date}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0 ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                      <span className="font-black text-sm shrink-0">${p.amount}</span>
                      {p.status === "PAID" && (
                        <button className="shrink-0 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition">Refund</button>
                      )}
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
