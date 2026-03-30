"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, MessageSquare, CreditCard, User,
  LogOut, Bell, Star, Clock, ChevronRight, BookOpen, TrendingUp,
  Users, DollarSign, CheckCircle, XCircle, Menu, X, Plus, BarChart3,
} from "lucide-react";
import {
  getTutorDashboardStats,
  type TutorStats,
} from "@/services/tutor";
import TutorBookingsSection from "@/components/tutor/TutorBookingsSection";
import ReviewsSection from "@/components/tutor/ReviewsSection";


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
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await getTutorDashboardStats();

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
    { label: "Total Earnings", value: `$${stats?.totalEarnings || 0}`, icon: DollarSign, change: "All time", positive: true },
    { label: "Total Sessions", value: stats?.totalSessions || 0, icon: BookOpen, change: "Completed", positive: true },
    { label: "Avg. Rating", value: `${stats?.averageRating || 0}★`, icon: Star, change: "Student reviews", positive: null },
    { label: "Active Students", value: stats?.activeStudents || 0, icon: Users, change: "Currently", positive: true },
  ];

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

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {sideOpen && <span className="whitespace-nowrap">{label}</span>}
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
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
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

          {/* Content based on active tab */}
          {active === "dashboard" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <TutorBookingsSection />
              <ReviewsSection />
            </div>
          )}

          {active === "bookings" && <TutorBookingsSection />}
          {active === "availability" && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Availability settings coming soon...</p>
            </div>
          )}
          {active === "earnings" && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Earnings analytics coming soon...</p>
            </div>
          )}
          {active === "messages" && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Messages coming soon...</p>
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
