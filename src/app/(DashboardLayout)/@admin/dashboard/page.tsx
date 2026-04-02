"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, BookOpen, CreditCard, ShieldCheck,
  LogOut, Bell, Menu, X, UserCheck, Activity, 
  Plus, GraduationCap, Globe, Search, Pencil, Trash2, UserPlus, Settings
} from "lucide-react";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "@/services/admin";

// Existing Components
import UsersSection from "@/components/ui/admin/UsersSection";
import PendingTutorsSection from "@/components/ui/admin/PendingTutorsSection";
import RevenueSection from "@/components/ui/admin/RevenueSection";
import PaymentsSection from "@/components/ui/admin/PaymentsSection";
import BookingsSection from "@/components/ui/admin/BookingsSection";
import Link from "next/link";
import SubjectsSection from "@/components/ui/admin/SubjectsSection";
import LanguagesSection from "@/components/ui/admin/LanguageSection";

// ─────────────────────────────────────────────────────────────
//  MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────

const navItems = [
  { id: "overview",  icon: LayoutDashboard, label: "Overview" },
  { id: "users",     icon: Users,           label: "Students" },
  { id: "tutors",    icon: UserCheck,       label: "Teachers" },
  { id: "bookings",  icon: BookOpen,        label: "Bookings" },
  { id: "payments",  icon: CreditCard,      label: "Payments" },
  { id: "subjects",  icon: GraduationCap,   label: "Subjects" },
  { id: "languages", icon: Globe,           label: "Languages" },
  { id: "admins",    icon: Settings,        label: "Admins" },
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
    { 
      label: "Total Students", 
      value: stats?.totalStudents || 0, 
      icon: Users, 
      change: "Registered", 
      positive: true 
    },
    { 
      label: "Total Teachers", 
      value: stats?.totalTutors || 0, 
      icon: UserCheck, 
      change: "Verified", 
      positive: true 
    },
    { 
      label: "Total Bookings", 
      value: stats?.totalBookings || 0, 
      icon: BookOpen, 
      change: "Sessions", 
      positive: null 
    },
    { 
      label: "Platform Users", 
      value: stats?.totalUsers || 0, 
      icon: Activity, 
      change: "Active Growth", 
      positive: true 
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <Link href="/">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </Link>
          {sideOpen && <span className="ml-3 text-[15px] font-bold whitespace-nowrap">TutorByte Admin</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition">
            <LogOut className="h-4 w-4 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(o => !o)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-border">
              {sideOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[15px] font-bold capitalize">{active.replace('-', ' ')}</p>
              <p className="text-xs text-muted-foreground">TutorByte Control Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Quick Add Actions */}
             {(active === "subjects" || active === "languages" || active === "admins") && (
                <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">
                  <Plus className="h-4 w-4" /> Add {active.slice(0, -1)}
                </button>
             )}
            <button className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Bar - Shown on Overview */}
          {active === "overview" && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
              {platformStats.map(({ label, value, icon: Icon, change, positive }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-black tracking-tight">{loading ? "..." : value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                  <p className={`text-xs font-semibold mt-2 ${positive ? "text-emerald-600" : "text-muted-foreground"}`}>{change}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Content Switching */}
          <div className="animate-in fade-in duration-500">
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

            {/* New Sections using design from File 1 */}
            {active === "subjects" && <SubjectsSection />}
            {active === "languages" && <LanguagesSection />}
            {active === "admins" && <AdminsManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminsManagement() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg">Administrator Management</h3>
            <p className="text-muted-foreground text-sm mb-6">Create and manage access for platform admins</p>
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20">
                Create New Admin Account
            </button>
        </div>
    );
}