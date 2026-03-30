"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, MessageSquare, CreditCard,
  User, LogOut, Search, Bell, Star, Clock, ChevronRight,
  BookOpen, TrendingUp, Plus, Filter, Menu, X,
} from "lucide-react";
import {
  getStudentDashboardStats,
  type StudentStats,
} from "@/services/student";
import StudentBookingsSection from "@/components/student/StudentBookingsSection";


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
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await getStudentDashboardStats();

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mockStats = [
    { label: "Total Sessions", value: stats?.totalSessions || 0, icon: BookOpen, change: "All time", positive: true },
    { label: "Hours Learned", value: `${stats?.hoursLearned || 0}h`, icon: Clock, change: "Completed", positive: true },
    { label: "Total Spent", value: `$${stats?.totalSpent || 0}`, icon: CreditCard, change: "All time", positive: null },
    { label: "Avg. Rating", value: `${stats?.averageRating || 0}★`, icon: Star, change: "Your reviews", positive: null },
  ];

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
              <p className="text-[15px] font-bold text-foreground">Welcome back! 👋</p>
              <p className="text-xs text-muted-foreground">Keep learning and growing</p>
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

          {/* Content based on active tab */}
          {active === "dashboard" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <StudentBookingsSection />
            </div>
          )}

          {active === "bookings" && <StudentBookingsSection />}
          {active === "messages" && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Messages coming soon...</p>
            </div>
          )}
          {active === "payments" && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Payments section coming soon...</p>
            </div>
          )}
          {active === "profile" && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Profile settings coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
