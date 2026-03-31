"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Calendar, MessageSquare, DollarSign, User,
  LogOut, Bell, Star, Clock, Menu, X, BookOpen, Activity, Settings
} from "lucide-react";
import { getTutorDashboardStats, type TutorStats } from "@/services/tutor";

// নতুন সেকশন কম্পোনেন্টসমূহ (নিচে বর্ণনা করা হয়েছে)
import TutorBookingsSection from "@/components/ui/tutor/TutorBookingsSection";

import ReviewsSection from "@/components/ui/tutor/ReviewsSection";
import AvailabilitySection from "@/components/ui/tutor/AvailabilitySection";
import TutorProfileSection from "@/components/ui/tutor/TutorProfileSection";

const navItems = [
  { id: "dashboard",    icon: LayoutDashboard, label: "Overview" },
  { id: "bookings",     icon: Calendar,        label: "Bookings" },
  { id: "availability", icon: Clock,           label: "Availability" },
  { id: "earnings",     icon: DollarSign,      label: "Earnings" },
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
        const res = await getTutorDashboardStats();
        if (res.success) setStats(res.data);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const tutorStats = [
    { label: "Total Earnings", value: `$${stats?.totalEarnings || 0}`, icon: DollarSign, change: "Current Balance", positive: true },
    { label: "Total Sessions", value: stats?.totalSessions || 0, icon: BookOpen, change: "Lifetime", positive: true },
    { label: "Avg. Rating",    value: `${stats?.averageRating || 0}★`, icon: Star, change: "Student Feedback", positive: null },
    { label: "Active Students", value: stats?.activeStudents || 0, icon: Activity, change: "This month", positive: true },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="h-4 w-4" />
          </div>
          {sideOpen && <span className="ml-3 text-[15px] font-bold whitespace-nowrap">TutorByte</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
            <button onClick={() => setSideOpen(o => !o)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted">
              {sideOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[15px] font-bold capitalize">{active} Panel</p>
              <p className="text-xs text-muted-foreground">Welcome back, Tutor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            </button>
            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
               {/* Tutor Avatar */}
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {/* Stats Summary - Always on Dashboard */}
          {active === "dashboard" && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
              {tutorStats.map(({ label, value, icon: Icon, change, positive }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-hover hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-black tracking-tight">{loading ? "..." : value}</p>
                  <p className="text-xs font-semibold mt-2 text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className={`text-[10px] mt-1 ${positive ? "text-emerald-600" : "text-muted-foreground"}`}>{change}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Content */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {active === "dashboard" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <TutorBookingsSection limit={5} />
                <ReviewsSection />
              </div>
            )}

            {active === "bookings" && <TutorBookingsSection />}
            {active === "availability" && <AvailabilitySection />}
            {/* {active === "earnings" && <EarningsSection />} */}
            {active === "profile" && <TutorProfileSection />}
          </div>
        </main>
      </div>
    </div>
  );
}