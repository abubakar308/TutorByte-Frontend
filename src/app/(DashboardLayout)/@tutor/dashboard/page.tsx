"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard, Calendar, DollarSign, User,
  LogOut, Bell, Star, Clock, Menu, X, BookOpen, Activity, 
  ChevronRight, TrendingUp
} from "lucide-react";

// Actions & Services
import { getTutorDashboardStats, type TutorStats } from "@/services/tutor";
import { getCurrentUser, logOut, type DecodedUser } from "@/services/auth";

// Section Components
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
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        // ১. ইউজারের তথ্য নেওয়া (Server Action থেকে)
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // ২. ড্যাশবোর্ড স্ট্যাটস নেওয়া
        const res = await getTutorDashboardStats();
        if (res.success) setStats(res.data);
      } catch (error) {
        console.error("Dashboard Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const handleLogout = async () => {
    await logOut();
    window.location.href = "/login";
  };

  const tutorStats = [
    { 
      label: "Total Earnings", 
      value: stats?.totalEarnings ? `$${stats.totalEarnings.toLocaleString()}` : "$0", 
      icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" 
    },
    { 
      label: "Total Sessions", 
      value: stats?.totalSessions || 0, 
      icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10" 
    },
    { 
      label: "Avg. Rating",    
      value: stats?.averageRating ? `${stats.averageRating.toFixed(1)}★` : "0★", 
      icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" 
    },
    { 
      label: "Active Students", 
      value: stats?.activeStudents || 0, 
      icon: Activity, color: "text-violet-600", bg: "bg-violet-500/10" 
    },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-background text-foreground overflow-hidden font-sans">
      
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-64" : "w-20"} hidden md:flex flex-col border-r border-border bg-card transition-all duration-500 shrink-0 z-50`}>
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="h-5 w-5" />
          </div>
          {sideOpen && <span className="ml-3 text-lg font-black tracking-tight text-primary uppercase">TutorByte</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button 
              key={id} 
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                active === id 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sideOpen && <span className="whitespace-nowrap">{label}</span>}
              {active === id && sideOpen && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors">
            <LogOut className="h-5 w-5 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6 z-40">
          <div className="flex items-center gap-5">
            <button onClick={() => setSideOpen(o => !o)} className="h-10 w-10 flex items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground hover:text-primary transition-all">
              {sideOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h2 className="text-lg font-black capitalize tracking-tight leading-none">{active}</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative h-11 w-11 flex items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500 ring-4 ring-card animate-pulse" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-border ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-none">{user?.name || "Tutor"}</p>
                <p className="text-[10px] font-bold text-primary uppercase mt-1">{user?.role || "PROFESSIONAL"}</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-sm">
                 <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'T'}`} alt="avatar" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          {/* Welcome Message */}
          {active === "dashboard" && (
             <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome Back, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="text-muted-foreground mt-1 font-medium italic">Manage your teaching schedule and student progress.</p>
             </div>
          )}

          {/* Stats Grid */}
          {active === "dashboard" && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {tutorStats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color} mb-5 group-hover:rotate-12 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tighter">{loading ? "..." : value}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Sections with Fade-in Animation */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {active === "dashboard" && (
              <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                <div className="space-y-8">
                  <TutorBookingsSection limit={5} />
                </div>
                <div className="space-y-8">
                  <ReviewsSection />
                  <div className="rounded-[2.5rem] bg-primary p-8 text-primary-foreground relative group overflow-hidden">
                     <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                     <h4 className="text-xl font-black italic uppercase">Pro Tip</h4>
                     <p className="text-sm opacity-90 mt-2 font-medium">Keep your availability updated to rank higher in student searches!</p>
                     <button onClick={() => setActive("availability")} className="mt-6 rounded-xl bg-white px-5 py-2.5 text-xs font-black text-primary transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
                        Manage Slots
                     </button>
                  </div>
                </div>
              </div>
            )}

            {active === "bookings" && <div className="max-w-5xl mx-auto"><TutorBookingsSection /></div>}
            {active === "availability" && <div className="max-w-5xl mx-auto"><AvailabilitySection /></div>}
            {active === "profile" && <div className="max-w-4xl mx-auto"><TutorProfileSection /></div>}
            
            {active === "earnings" && (
               <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[3rem] border-4 border-dashed border-border bg-card/50 text-center p-10">
                  <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <DollarSign className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Earnings Dashboard</h3>
                  <p className="text-muted-foreground max-w-sm mt-2 font-medium">Detailed financial analytics and withdrawal options will be available in the next update.</p>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}