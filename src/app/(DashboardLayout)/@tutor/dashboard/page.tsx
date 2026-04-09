"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  LayoutDashboard, Calendar, DollarSign, User,
  LogOut, Bell, Star, Clock, Menu, X, BookOpen, Activity, 
  ChevronRight, TrendingUp, BarChart3, Sun, Moon
} from "lucide-react";

// Actions & Services
import { getTutorDashboardStats, type TutorStats } from "@/services/tutor";
import { getCurrentUser, logOut, type DecodedUser } from "@/services/auth";

// Section Components
import TutorBookingsSection from "@/components/ui/tutor/TutorBookingsSection";
import ReviewsSection from "@/components/ui/tutor/ReviewsSection";
import AvailabilitySection from "@/components/ui/tutor/AvailabilitySection";
import TutorProfileSection from "@/components/ui/tutor/TutorProfileSection";
import Link from "next/link";

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
  const [stats, setStats] = useState<any | null>(null); // Type update based on new JSON
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // API Call uncommented and active
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
  
        const currentUser = await getCurrentUser();
        setUser(currentUser);

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

  // Stats mapped to the new JSON structure
  const tutorStats = [
    { 
      label: "Total Earnings", 
      value: stats?.overview?.totalEarnings ? `$${stats.overview.totalEarnings.toLocaleString()}` : "$0", 
      icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" 
    },
    { 
      label: "Total Sessions", 
      value: stats?.overview?.totalBookings || 0, 
      icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10" 
    },
    { 
      label: "Avg. Rating",    
      value: stats?.overview?.averageRating ? `${stats.overview.averageRating.toFixed(1)}★` : "0★", 
      icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" 
    },
    { 
      // Changed to 'This Month Bookings' since activeStudents isn't in the new JSON
      label: "Monthly Bookings", 
      value: stats?.activity?.thisMonthBookings || 0, 
      icon: Activity, color: "text-violet-600", bg: "bg-violet-500/10" 
    },
    
  ];

    const totalEarnings = Number(stats?.overview?.totalEarnings || 0);
  const totalBookings = Number(stats?.overview?.totalBookings || 0);
  const avgRating = Number(stats?.overview?.averageRating || 0);
  const thisMonthBookings = Number(stats?.activity?.thisMonthBookings || 0);

  const earningsChartData = [
    {
      name: "Earnings",
      value: totalEarnings,
    },
    {
      name: "Sessions",
      value: totalBookings,
    },
    {
      name: "This Month",
      value: thisMonthBookings,
    },
  ];

  const performanceData = [
    {
      name: "Rating",
      value: Math.min(avgRating * 20, 100),
      fill: "hsl(var(--primary))",
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`${sideOpen ? "w-64" : "w-20"} hidden md:flex flex-col border-r border-border bg-card transition-all duration-500 shrink-0 z-50`}>
        <div className="flex h-20 items-center border-b border-border px-6">
         <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="h-5 w-5" />
          </div>
          </Link>
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
            <button
              onClick={toggleTheme}
              className="relative h-11 w-11 flex items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground hover:text-foreground transition-all"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
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
  <div className="space-y-8">
    <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
      <TutorAnalyticsChart
        loading={loading}
        data={earningsChartData}
        totalEarnings={totalEarnings}
        totalBookings={totalBookings}
      />

      <TutorPerformanceChart
        loading={loading}
        rating={avgRating}
        thisMonthBookings={thisMonthBookings}
        data={performanceData}
      />
    </div>

    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-8">
        <TutorBookingsSection />
      </div>

      <div className="space-y-8">
        <ReviewsSection />

        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 text-primary-foreground group">
          <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 transition-transform duration-700 group-hover:scale-125" />
          <h4 className="text-xl font-black italic uppercase">Pro Tip</h4>
          <p className="mt-2 text-sm font-medium opacity-90">
            Keep your availability updated to rank higher in student searches!
          </p>
          <button
            onClick={() => setActive("availability")}
            className="mt-6 rounded-xl bg-white px-5 py-2.5 text-xs font-black text-primary shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95"
          >
            Manage Slots
          </button>
        </div>
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



function TutorAnalyticsChart({
  loading,
  data,
  totalEarnings,
  totalBookings,
}: {
  loading: boolean;
  data: { name: string; value: number }[];
  totalEarnings: number;
  totalBookings: number;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Analytics Overview</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your teaching earnings and sessions summary
          </p>
        </div>

        <div className="rounded-2xl bg-muted/60 px-4 py-3 text-right">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Total Revenue
          </p>
          <p className="text-lg font-black">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-[320px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading analytics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.15}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", opacity: 0.65, fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", opacity: 0.65, fontSize: 12 }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />
              <Bar
                dataKey="value"
                radius={[14, 14, 6, 6]}
                fill="hsl(var(--primary))"
                maxBarSize={56}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-muted/40 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Total Sessions
          </p>
          <p className="mt-1 text-2xl font-black">{totalBookings}</p>
        </div>
        <div className="rounded-2xl bg-muted/40 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Avg Revenue / Session
          </p>
          <p className="mt-1 text-2xl font-black">
            ${totalBookings > 0 ? (totalEarnings / totalBookings).toFixed(1) : "0.0"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TutorPerformanceChart({
  loading,
  rating,
  thisMonthBookings,
  data,
}: {
  loading: boolean;
  rating: number;
  thisMonthBookings: number;
  data: { name: string; value: number; fill: string }[];
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Star className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Performance Score</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on your tutor rating and activity
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="h-[240px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Loading performance...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={data}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={18}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="-mt-28 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Average Rating
          </p>
          <h4 className="mt-2 text-4xl font-black tracking-tighter">
            {rating ? rating.toFixed(1) : "0.0"}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">out of 5.0</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-muted/40 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            This Month
          </p>
          <p className="mt-1 text-2xl font-black">{thisMonthBookings}</p>
          <p className="mt-1 text-xs text-muted-foreground">Bookings completed</p>
        </div>

        <div className="rounded-2xl bg-muted/40 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Status
          </p>
          <p className="mt-1 text-2xl font-black">
            {rating >= 4.5 ? "Excellent" : rating >= 3.5 ? "Good" : "Growing"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Current tutor performance</p>
        </div>
      </div>
    </div>
  );
}