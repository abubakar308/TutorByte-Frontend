"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, MessageSquare, CreditCard,
  User, LogOut, Search, Bell, Star, Clock, ChevronRight,
  BookOpen, TrendingUp, Plus, Filter, Menu, X,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  REJECTED:  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const mockStats = [
  { label: "Total Sessions",  value: "12",   icon: BookOpen,    change: "+3 this month",  positive: true },
  { label: "Hours Learned",   value: "18h",  icon: Clock,       change: "+5h this month", positive: true },
  { label: "Total Spent",     value: "$486", icon: CreditCard,  change: "Last 30 days",   positive: null },
  { label: "Avg. Rating",     value: "4.8★", icon: Star,        change: "Across 8 reviews", positive: null },
];

const mockBookings = [
  { id: "1", tutor: "Sarah Chen",    subject: "Mathematics", date: "Aug 12, 2025", time: "10:00 – 11:00", status: "ACCEPTED",  amount: 45, initials: "SC" },
  { id: "2", tutor: "James Okafor",  subject: "Physics",     date: "Aug 08, 2025", time: "14:00 – 15:00", status: "COMPLETED", amount: 38, initials: "JO" },
  { id: "3", tutor: "Priya Sharma",  subject: "English",     date: "Aug 05, 2025", time: "09:00 – 10:00", status: "COMPLETED", amount: 52, initials: "PS" },
  { id: "4", tutor: "Marco Rossi",   subject: "Spanish",     date: "Aug 15, 2025", time: "16:00 – 17:00", status: "PENDING",   amount: 35, initials: "MR" },
];

const recommended = [
  { name: "Yuki Tanaka",   subject: "Python",    rating: 4.9, rate: 60, initials: "YT" },
  { name: "Amira Hassan",  subject: "Design",    rating: 4.8, rate: 48, initials: "AH" },
  { name: "Carlos Vega",   subject: "Chemistry", rating: 4.7, rate: 42, initials: "CV" },
];

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "bookings",  icon: Calendar,         label: "My Bookings" },
  { id: "search",    icon: Search,           label: "Find Tutors",   href: "/tutors" },
  { id: "messages",  icon: MessageSquare,    label: "Messages" },
  { id: "payments",  icon: CreditCard,       label: "Payments" },
  { id: "profile",   icon: User,             label: "Profile" },
];

export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredBookings = statusFilter === "ALL"
    ? mockBookings
    : mockBookings.filter(b => b.status === statusFilter);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ───────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        {/* Logo */}
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          {sideOpen && <span className="ml-3 text-[15px] font-bold text-foreground whitespace-nowrap">TutorByte</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, icon: Icon, label, href }) => (
            href ? (
              <Link key={id} href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground`}>
                <Icon className="h-4 w-4 shrink-0" />
                {sideOpen && <span className="whitespace-nowrap">{label}</span>}
              </Link>
            ) : (
              <button key={id} onClick={() => setActive(id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {sideOpen && <span className="whitespace-nowrap">{label}</span>}
              </button>
            )
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-border p-3">
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition">
            <LogOut className="h-4 w-4 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(o => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              {sideOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[15px] font-bold text-foreground">Good morning, Alex! 👋</p>
              <p className="text-xs text-muted-foreground">Ready to learn something new?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <Link href="/tutors"
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition">
              <Plus className="h-4 w-4" /> Book Session
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
            {mockStats.map(({ label, value, icon: Icon, change, positive }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                <p className={`text-xs font-semibold mt-2 ${positive === true ? "text-emerald-600 dark:text-emerald-400" : positive === false ? "text-rose-500" : "text-muted-foreground"}`}>
                  {change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Bookings */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold text-foreground">My Bookings</h2>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card text-foreground outline-none cursor-pointer">
                    <option value="ALL">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-border">
                {filteredBookings.map(b => (
                  <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      {b.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{b.tutor}</p>
                      <p className="text-xs text-muted-foreground">{b.subject}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">{b.date}</p>
                      <p className="text-xs font-medium text-foreground">{b.time}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold shrink-0 ${STATUS_STYLES[b.status]}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                    <p className="font-bold text-sm text-foreground shrink-0">${b.amount}</p>
                    {b.status === "ACCEPTED" && (
                      <button className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
                        Pay now
                      </button>
                    )}
                    {b.status === "COMPLETED" && (
                      <button className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition">
                        Review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar panel */}
            <div className="space-y-5">
              {/* Upcoming */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-bold text-foreground text-sm">Next Session</h3>
                </div>
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">SC</div>
                    <div>
                      <p className="font-semibold text-sm">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">Mathematics</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Aug 12, 2025</p>
                    <p className="text-lg font-black text-foreground mt-0.5">10:00 AM</p>
                    <p className="text-xs text-muted-foreground">60 minutes</p>
                  </div>
                  <button className="mt-3 w-full rounded-xl border border-border py-2 text-xs font-semibold text-foreground hover:bg-muted transition flex items-center justify-center gap-1">
                    Join session <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Recommended */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-sm">Recommended</h3>
                  <Link href="/tutors" className="text-xs font-semibold text-primary">View all</Link>
                </div>
                <div className="divide-y divide-border">
                  {recommended.map(t => (
                    <div key={t.name} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">{t.initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.subject}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-foreground">${t.rate}/hr</p>
                        <div className="flex items-center gap-0.5 justify-end mt-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">{t.rating}</span>
                        </div>
                      </div>
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
