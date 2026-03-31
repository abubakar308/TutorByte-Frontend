"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, MessageSquare, CreditCard,
  User, LogOut, Search, Bell, Star, Clock, ChevronRight,
  BookOpen, Plus, Menu, X, Loader2, Sparkles, Target
} from "lucide-react";

// Actions & Services
import { getStudentDashboardStats, type StudentStats } from "@/services/student";
import { getCurrentUser, logOut, type DecodedUser } from "@/services/auth";
// Section Components
import StudentBookingsSection from "@/components/ui/student/StudentBookingsSection";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
  { id: "bookings",  icon: Calendar,        label: "My Bookings" },
  { id: "search",    icon: Search,          label: "Find Tutors", href: "/tutors" },
  { id: "messages",  icon: MessageSquare,   label: "Messages" },
  { id: "payments",  icon: CreditCard,      label: "Payments" },
  { id: "profile",   icon: User,            label: "Settings" },
];

export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const initDashboard = async () => {
  //     try {
  //       setLoading(true);
  //       // ১. ইউজারের তথ্য নেওয়া (Auth Action)
  //       const currentUser = await getCurrentUser();
  //       setUser(currentUser);

  //       // ২. স্টুডেন্ট স্ট্যাটস নেওয়া
  //       const res = await getStudentDashboardStats();
  //       if (res.success) setStats(res.data);
  //     } catch (error) {
  //       console.error("Dashboard Load Error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   initDashboard();
  // }, []);

  const handleLogout = async () => {
    await logOut();
    window.location.href = "/login";
  };

  const studentStats = [
    { 
      label: "Total Sessions", 
      value: stats?.totalSessions || 0, 
      icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10",
      desc: "Completed lessons"
    },
    { 
      label: "Hours Learned", 
      value: `${stats?.hoursLearned || 0}h`, 
      icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10",
      desc: "Time spent learning"
    },
    { 
      label: "Total Invested", 
      value: `$${stats?.totalSpent || 0}`, 
      icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-500/10",
      desc: "Skills investment"
    },
    { 
      label: "Avg. Rating", 
      value: `${stats?.averageRating?.toFixed(1) || 0}★`, 
      icon: Star, color: "text-rose-500", bg: "bg-rose-500/10",
      desc: "Given reviews"
    },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-background text-foreground overflow-hidden font-sans">
      
      {/* ── SIDEBAR ───────────────────────────────── */}
      <aside className={`${sideOpen ? "w-64" : "w-20"} hidden md:flex flex-col border-r border-border bg-card transition-all duration-500 shrink-0 z-50`}>
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          {sideOpen && <span className="ml-3 text-lg font-black tracking-tight text-primary uppercase italic">TutorByte</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map(({ id, icon: Icon, label, href }) => {
            const content = (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                {sideOpen && <span className="whitespace-nowrap">{label}</span>}
                {active === id && sideOpen && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </>
            );

            return href ? (
              <Link key={id} href={href} className="w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                {content}
              </Link>
            ) : (
              <button key={id} onClick={() => setActive(id)}
                className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  active === id 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                {content}
              </button>
            );
          })}
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
            <div className="hidden sm:block">
              <h2 className="text-lg font-black capitalize tracking-tight leading-none">{active}</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative h-11 w-11 flex items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-card animate-pulse" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-border ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-none">{user?.name || "Student"}</p>
                <p className="text-[10px] font-bold text-primary uppercase mt-1">Learner</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-sm">
                 <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'S'}`} alt="avatar" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          {/* Welcome Message */}
          {active === "dashboard" && (
             <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-foreground">Hello, {user?.name?.split(' ')[0]}! 🚀</h1>
                  <p className="text-muted-foreground mt-1 font-medium italic">Ready to master a new skill today?</p>
                </div>
                <Link href="/tutors" className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  <Plus className="h-4 w-4" /> Book New Session
                </Link>
             </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Data...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              {active === "dashboard" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {studentStats.map(({ label, value, icon: Icon, color, bg, desc }) => (
                    <div key={label} className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color} mb-5 group-hover:rotate-12 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                        <p className="text-[10px] text-muted-foreground/60 font-medium">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Content Sections */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {active === "dashboard" && (
                  <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    <div className="space-y-8">
                      <StudentBookingsSection />
                    </div>
                    <div className="space-y-8">
                      {/* Learning Progress / Target Card */}
                      <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white relative group overflow-hidden shadow-2xl">
                         <Target className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                         <div className="relative z-10">
                            <h4 className="text-xl font-black italic uppercase text-primary">Your Goal</h4>
                            <p className="text-sm opacity-80 mt-2 font-medium">Complete 5 more hours to reach your weekly learning target!</p>
                            <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                            </div>
                            <p className="text-[10px] mt-2 font-bold uppercase tracking-widest opacity-50">65% of weekly goal</p>
                         </div>
                      </div>

                      {/* Quick Help Card */}
                      <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                         <h4 className="font-black text-lg">Need Help?</h4>
                         <p className="text-sm text-muted-foreground mt-2 font-medium">Check our guide on how to get the best from your tutors.</p>
                         <button className="mt-6 w-full py-3 rounded-xl border border-border font-bold text-sm hover:bg-muted transition-colors">
                            Read Guide
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {active === "bookings" && <div className="max-w-5xl mx-auto"><StudentBookingsSection /></div>}
                
                {active === "messages" && (
                   <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[3rem] border-4 border-dashed border-border bg-card/50 text-center p-10">
                      <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                        <MessageSquare className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">Inbox</h3>
                      <p className="text-muted-foreground max-w-sm mt-2 font-medium">Chat with your tutors and get help with your lessons. Feature coming soon!</p>
                   </div>
                )}

                {active === "payments" && (
                   <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[3rem] border-4 border-dashed border-border bg-card/50 text-center p-10">
                      <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <CreditCard className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">Payment History</h3>
                      <p className="text-muted-foreground max-w-sm mt-2 font-medium">Track your invoices and payment methods securely.</p>
                   </div>
                )}

                {active === "profile" && (
                   <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-card border border-border p-10">
                      <h3 className="text-2xl font-black tracking-tight mb-8">Account Settings</h3>
                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Name</label>
                               <div className="h-14 w-full bg-muted/40 border border-border rounded-2xl flex items-center px-5 font-bold text-sm">{user?.name}</div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Email Address</label>
                               <div className="h-14 w-full bg-muted/40 border border-border rounded-2xl flex items-center px-5 font-bold text-sm text-muted-foreground">{user?.email}</div>
                            </div>
                         </div>
                         <button className="px-8 h-14 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Update Profile
                         </button>
                      </div>
                   </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}