"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, BookOpen, CreditCard, ShieldCheck,
  LogOut, Bell,  Menu, X, DollarSign,
  UserCheck, Activity, 
} from "lucide-react";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "@/services/admin";
import UsersSection from "@/components/admin/UsersSection";
import PendingTutorsSection from "@/components/admin/PendingTutorsSection";
import RevenueSection from "@/components/admin/RevenueSection";
import PaymentsSection from "@/components/admin/PaymentsSection";
import BookingsSection from "@/components/admin/BookingsSection";
import Link from "next/link";


const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  BLOCKED:   "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "users",     icon: Users,           label: "Users" },
  { id: "tutors",    icon: UserCheck,       label: "Tutors" },
  { id: "bookings",  icon: BookOpen,        label: "Bookings" },
  { id: "payments",  icon: CreditCard,      label: "Payments" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await getAdminDashboardStats();

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const platformStats = [
    { label: "Total Revenue", value: `$${stats?.totalUsers || 0}`, icon: DollarSign, change: "All time", positive: true },
    { label: "Total Users", value: stats?.totalStudents || 0, icon: Users, change: "Registered", positive: true },
    { label: "Active Sessions", value: stats?.totalTutors || 0, icon: Activity, change: "Live now", positive: null },
    { label: "Pending Approvals", value: stats?.totalBookings || 0, icon: ShieldCheck, change: "Awaiting", positive: null },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="flex h-[68px] items-center border-b border-border px-4">
         <Link href="/" >    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
          </div></Link>
          {sideOpen && <span className="ml-3 text-[15px] font-bold whitespace-nowrap">TutorByte Admin</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {sideOpen && <span className="whitespace-nowrap flex-1 text-left">{label}</span>}
              {sideOpen && id === "tutors" && stats?.totalBookings && stats.totalBookings > 0 && (
                <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5">{stats.totalBookings}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button onClick={() => {  }}
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
             {}
            </div>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats - Always visible on overview */}
          {active === "overview" && (
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
          )}

          {/* Content based on active tab */}
          {active === "overview" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <PendingTutorsSection />
              <RevenueSection />
            </div>
          )}

          {active === "users" && <UsersSection />}
          {active === "tutors" && <PendingTutorsSection />}
          {active === "bookings" && <BookingsSection />}
          {active === "payments" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <PaymentsSection />
              <RevenueSection />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
