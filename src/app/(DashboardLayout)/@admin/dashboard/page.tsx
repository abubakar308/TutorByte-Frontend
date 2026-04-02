"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, BookOpen, CreditCard, ShieldCheck,
  LogOut, Bell, Menu, X, UserCheck, Activity, 
  Plus, GraduationCap, Globe, UserPlus, Settings
} from "lucide-react";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "@/services/admin";
import Link from "next/link";

// UI Sections
import UsersSection from "@/components/ui/admin/UsersSection";
import PendingTutorsSection from "@/components/ui/admin/PendingTutorsSection";
import RevenueSection from "@/components/ui/admin/RevenueSection";
import PaymentsSection from "@/components/ui/admin/PaymentsSection";
import BookingsSection from "@/components/ui/admin/BookingsSection";
import SubjectsSection from "@/components/ui/admin/SubjectsSection";
import LanguagesSection from "@/components/ui/admin/LanguageSection";

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
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const platformStats = [
    { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, change: "Active Members", positive: true },
    { label: "Total Teachers", value: stats?.totalTutors || 0, icon: UserCheck, change: "Verified Experts", positive: true },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: BookOpen, change: "All Sessions", positive: null },
    { label: "Net Revenue",    value: `$${stats?.totalRevenue || 0}`, icon: Activity, change: "Platform Earnings", positive: true },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-60" : "w-[68px]"} flex flex-col border-r border-border bg-card transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {sideOpen && <span className="text-[16px] font-black tracking-tight whitespace-nowrap">TutorByte</span>}
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active === id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {sideOpen && <span className="whitespace-nowrap flex-1 text-left">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition">
            <LogOut className="h-4 w-4 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(o => !o)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition">
              {sideOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[15px] font-bold capitalize">{active.replace('-', ' ')}</p>
              <p className="text-xs text-muted-foreground">TutorByte Control Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {["subjects", "languages", "admins"].includes(active) && (
                <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-md">
                  <Plus className="h-4 w-4" /> Add {active.slice(0, -1)}
                </button>
             )}
            <button className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-card" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {/* Stats Bar */}
          {active === "overview" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {platformStats.map(({ label, value, icon: Icon, change, positive }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${positive ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                      {change}
                    </span>
                  </div>
                  <p className="text-2xl font-black tracking-tight">{loading ? "..." : value}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Sections */}
          <div className="transition-all duration-300">
            {active === "overview" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <PendingTutorsSection />
                <RevenueSection />
              </div>
            )}

            {active === "users" && <UsersSection />}
            {active === "tutors" && <PendingTutorsSection />}
            {active === "bookings" && <BookingsSection />}
            {active === "payments" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <PaymentsSection />
                <RevenueSection />
              </div>
            )}
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
        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-3xl border-2 border-dashed border-border">
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 rotate-3">
                <UserPlus className="h-10 w-10" />
            </div>
            <h3 className="font-bold text-xl mb-2">Administrator Management</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm text-center">Assign roles and manage access levels for your platform administrators.</p>
            <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                Create New Admin Account
            </button>
        </div>
    );
}