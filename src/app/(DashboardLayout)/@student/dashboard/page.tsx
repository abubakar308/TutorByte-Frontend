"use client";


const MONTH_LABELS: Record<string, string> = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};

const formatMonthLabel = (value: string) => {
  if (!value) return "Unknown";

  const normalized = value.toString().trim().toLowerCase();

  return MONTH_LABELS[normalized] || value;
};

const formatHoursValue = (value: number) => {
  if (!Number.isFinite(value)) return "0h";
  if (value === 0) return "0h";
  return `${value}h`;
};


import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  CreditCard,
  User,
  LogOut,
  Search,
  Bell,
  Star,
  Clock,
  ChevronRight,
  BookOpen,
  Plus,
  Menu,
  X,
  Loader2,
  Sparkles,
  Target,
  Save,
  ChevronDown,
  Settings,
  Sun,
  Moon
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Actions & Services
import { getCurrentUser, logOut, type DecodedUser } from "@/services/auth";
import StudentBookingsSection from "@/components/ui/student/StudentBookingsSection";
import {
  getStudentDashboardStats,
  updateStudentProfile,
} from "@/services/student";
import DynamicPaymentHistory from "@/components/ui/shared/PaymentHistory";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
  { id: "bookings", icon: Calendar, label: "My Bookings" },
  { id: "search", icon: Search, label: "Find Tutors", href: "/tutors" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "payments", icon: CreditCard, label: "Payments" },
  { id: "profile", icon: User, label: "Settings" },
];

const CHART_COLORS = [
  "hsl(var(--primary))",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
];

export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [stats, setStats] = useState<any>(null);
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

  const [updateLoading, setUpdateLoading] = useState(false);
  const [newName, setNewName] = useState("");

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) setNewName(currentUser.name);

        const res = await getStudentDashboardStats();

        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = async () => {
    await logOut();
    window.location.href = "/login";
  };

  const handleProfileUpdate = async () => {
    if (!newName || newName === user?.name) return;

    setUpdateLoading(true);
    try {
      const res = await updateStudentProfile({ name: newName });
      if (res.success) {
        toast.success("Profile updated successfully!");
        if (user) setUser({ ...user, name: newName });
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const studentStats = [
    {
      label: "Total Sessions",
      value: stats?.totalSessions || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      desc: "Completed lessons",
    },
    {
      label: "Hours Learned",
      value: stats?.hoursLearned || "0h",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      desc: "Time spent learning",
    },
    {
      label: "Total Invested",
      value: `$${stats?.totalInvested || 0}`,
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      desc: "Skills investment",
    },
    {
      label: "Avg. Rating",
      value: `${Number(stats?.avgRating || 0).toFixed(1)}★`,
      icon: Star,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      desc: "Given reviews",
    },
  ];

  const monthlyLearningData = useMemo(() => {
    if (Array.isArray(stats?.monthlyLearning) && stats.monthlyLearning.length) {
      return stats.monthlyLearning.map((item: any) => ({
        month: formatMonthLabel(item.month),
        sessions: Number(item.sessions || 0),
        hours: Number(item.hours || 0),
      }));
    }

    if (Array.isArray(stats?.monthlyProgress) && stats.monthlyProgress.length) {
      return stats.monthlyProgress.map((item: any) => ({
        month: formatMonthLabel(item.month),
        sessions: Number(item.sessions || item.totalSessions || 0),
        hours: Number(item.hours || item.totalHours || 0),
      }));
    }

    return [
      {
        month: "Current Month",
        sessions: Number(stats?.totalSessions || 0),
        hours: Number(
          typeof stats?.hoursLearned === "string"
            ? parseFloat(stats.hoursLearned)
            : stats?.hoursLearned || 0
        ),
      },
    ];
  }, [stats]);

  const spendingTrendData = useMemo(() => {
    if (Array.isArray(stats?.spendingTrend) && stats.spendingTrend.length) {
      return stats.spendingTrend.map((item: any) => ({
        month: item.month,
        amount: Number(item.amount || 0),
      }));
    }

    if (Array.isArray(stats?.monthlyPayments) && stats.monthlyPayments.length) {
      return stats.monthlyPayments.map((item: any) => ({
        month: item.month,
        amount: Number(item.amount || 0),
      }));
    }

    return [
      { month: "Current", amount: Number(stats?.totalInvested || 0) },
    ];
  }, [stats]);

  const learningDistributionData = useMemo(() => {
    if (
      Array.isArray(stats?.subjectDistribution) &&
      stats.subjectDistribution.length
    ) {
      return stats.subjectDistribution.map((item: any) => ({
        name: item.subject || item.name || "Unknown",
        value: Number(item.value || item.sessions || 0),
      }));
    }

    if (
      Array.isArray(stats?.bookingStatusDistribution) &&
      stats.bookingStatusDistribution.length
    ) {
      return stats.bookingStatusDistribution.map((item: any) => ({
        name: item.status || item.name || "Unknown",
        value: Number(item.value || item.count || 0),
      }));
    }

    return [
      { name: "Sessions", value: Number(stats?.totalSessions || 0) },
      { name: "Reviews", value: Number(stats?.avgRating ? 1 : 0) },
    ];
  }, [stats]);

  const weeklyGoalPercent = useMemo(() => {
    const raw = Number(stats?.weeklyGoalPercent || 65);
    return Math.max(0, Math.min(100, raw));
  }, [stats]);

  return (
    <div className="flex h-screen overflow-hidden font-sans text-foreground bg-background">
      <aside
        className={`${sideOpen ? "w-64" : "w-20"
          } z-50 hidden shrink-0 flex-col border-r border-border bg-card transition-all duration-500 md:flex`}
      >
        <div className="flex h-20 items-center border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
          </Link>
          {sideOpen && (
            <span className="ml-3 text-lg font-black uppercase italic tracking-tight text-primary">
              TutorByte
            </span>
          )}
        </div>

        <nav className="mt-4 flex-1 space-y-2 p-4">
          {navItems.map(({ id, icon: Icon, label, href }) => {
            const content = (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                {sideOpen && <span className="whitespace-nowrap">{label}</span>}
                {active === id && sideOpen && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                )}
              </>
            );

            return href ? (
              <Link
                key={id}
                href={href}
                className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                {content}
              </Link>
            ) : (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${active === id
                  ? "scale-[1.02] bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {content}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-500/10"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="z-40 flex h-20 shrink-0 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSideOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-all hover:text-primary"
            >
              {sideOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="hidden sm:block">
              <h2 className="text-lg font-black capitalize leading-none tracking-tight">
                {active}
              </h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Student Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition hover:text-foreground"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition hover:text-primary">
              <Bell className="h-5 w-5" />
            </button>

            <div ref={profileMenuRef} className="relative">
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2 transition hover:border-primary/30"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black leading-none">
                    {user?.name || "Student"}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase text-primary">
                    Learner
                  </p>
                </div>

                <div className="h-11 w-11 overflow-hidden rounded-2xl border-2 border-primary/20 bg-primary/10 shadow-sm">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "S"
                      }`}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${profileMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl">
                  <button
                    onClick={() => {
                      setActive("profile");
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <User className="h-4 w-4 text-primary" />
                    Profile
                  </button>


                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Synchronizing Data...
              </p>
            </div>
          ) : (
            <>
              {active === "dashboard" && (
                <>
                  <div className="animate-in slide-in-from-left-4 mb-8 flex flex-col justify-between gap-4 fade-in duration-500 sm:flex-row sm:items-center">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight text-foreground">
                        Hello, {user?.name?.split(" ")[0]}! 🚀
                      </h1>
                      <p className="mt-1 italic text-muted-foreground font-medium">
                        Ready to master a new skill today?
                      </p>
                    </div>

                    <Link
                      href="/tutors"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="h-4 w-4" /> Book New Session
                    </Link>
                  </div>

                  <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {studentStats.map(
                      ({ label, value, icon: Icon, color, bg, desc }) => (
                        <div
                          key={label}
                          className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div
                            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color} transition-transform group-hover:rotate-12`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tighter">
                              {value}
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                              {label}
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground/60">
                              {desc}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mb-8 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm xl:col-span-2">
                      <div className="mb-6">
                        <h3 className="text-lg font-black tracking-tight">
                          Learning Progress
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Sessions and learning hours from dynamic dashboard data
                        </p>
                      </div>

                      <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyLearningData}
                            barGap={10}
                            barCategoryGap="22%"
                            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="hsl(var(--border))"
                              opacity={0.45}
                            />
                            <XAxis
                              dataKey="month"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                              interval={0}
                              angle={monthlyLearningData.length > 4 ? -20 : 0}
                              textAnchor={monthlyLearningData.length > 4 ? "end" : "middle"}
                              height={monthlyLearningData.length > 4 ? 60 : 35}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                              allowDecimals={false}
                            />
                            <Tooltip
                              cursor={false}
                              contentStyle={{
                                borderRadius: "18px",
                                border: "1px solid hsl(var(--border))",
                                background: "hsl(var(--background))",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                              }}
                              formatter={(value: any, name: any) => {
                                if (name === "hours") return [formatHoursValue(Number(value)), "Hours"];
                                if (name === "sessions") return [Number(value), "Sessions"];
                                return [value, name];
                              }}
                              labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Legend
                              wrapperStyle={{ paddingTop: 12 }}
                              formatter={(value) => (
                                <span className="text-sm font-semibold capitalize text-foreground">
                                  {value === "hours" ? "Hours" : "Sessions"}
                                </span>
                              )}
                            />
                            <Bar
                              dataKey="sessions"
                              name="sessions"
                              fill="#6366f1"
                              radius={[10, 10, 0, 0]}
                              maxBarSize={44}
                            />
                            <Bar
                              dataKey="hours"
                              name="hours"
                              fill="#22c55e"
                              radius={[10, 10, 0, 0]}
                              maxBarSize={44}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                      <div className="mb-6">
                        <h3 className="text-lg font-black tracking-tight">
                          Learning Distribution
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Dynamic category breakdown
                        </p>
                      </div>

                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={learningDistributionData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              innerRadius={55}
                              paddingAngle={3}
                              stroke="hsl(var(--background))"
                              strokeWidth={2}
                            >
                              {learningDistributionData.map((_entry: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                      <div className="mb-6">
                        <h3 className="text-lg font-black tracking-tight">
                          Spending Trend
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Dynamic payment and investment trend
                        </p>
                      </div>

                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={spendingTrendData.map((item: any) => ({
                              ...item,
                              month: formatMonthLabel(item.month),
                            }))}
                            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="hsl(var(--border))"
                              opacity={0.45}
                            />
                            <XAxis
                              dataKey="month"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                              interval={0}
                              angle={spendingTrendData.length > 4 ? -20 : 0}
                              textAnchor={spendingTrendData.length > 4 ? "end" : "middle"}
                              height={spendingTrendData.length > 4 ? 60 : 35}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "18px",
                                border: "1px solid hsl(var(--border))",
                                background: "hsl(var(--card))",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                              }}
                              formatter={(value: any) => [`$${Number(value)}`, "Amount"]}
                              labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="amount"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              dot={{ r: 4, fill: "hsl(var(--primary))" }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl group">
                        <Target className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10 transition-transform duration-700 group-hover:scale-125" />
                        <div className="relative z-10">
                          <h4 className="text-xl font-black uppercase italic text-primary">
                            Your Goal
                          </h4>
                          <p className="mt-2 text-sm font-medium opacity-80">
                            Keep going to reach your weekly learning target!
                          </p>

                          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${weeklyGoalPercent}%` }}
                            />
                          </div>

                          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
                            {weeklyGoalPercent}% of weekly goal
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                        <h4 className="text-base font-black tracking-tight">
                          Quick Insight
                        </h4>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Sessions
                            </span>
                            <span className="text-sm font-black text-foreground">
                              {stats?.totalSessions || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Hours
                            </span>
                            <span className="text-sm font-black text-foreground">
                              {stats?.hoursLearned || "0h"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Invested
                            </span>
                            <span className="text-sm font-black text-foreground">
                              ${stats?.totalInvested || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Avg Rating
                            </span>
                            <span className="text-sm font-black text-foreground">
                              {Number(stats?.avgRating || 0).toFixed(1)}★
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    <StudentBookingsSection />

                    <div className="space-y-8">
                      <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white relative overflow-hidden shadow-2xl group">
                        <Target className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 transition-transform duration-700 group-hover:scale-125" />
                        <div className="relative z-10">
                          <h4 className="text-xl font-black uppercase italic text-primary">
                            Your Goal
                          </h4>
                          <p className="mt-2 text-sm font-medium opacity-80">
                            Keep going to reach your weekly learning target!
                          </p>
                          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${weeklyGoalPercent}%` }}
                            />
                          </div>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
                            {weeklyGoalPercent}% of weekly goal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {active === "bookings" && <StudentBookingsSection />}

              {active === "profile" && (
                <div className="mx-auto max-w-4xl animate-in slide-in-from-bottom-4 rounded-[2.5rem] border border-border bg-card p-10 fade-in">
                  <h3 className="mb-8 text-2xl font-black tracking-tight">
                    Account Settings
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="h-14 w-full rounded-2xl border border-border bg-muted/40 px-5 text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Email Address
                        </label>
                        <div className="flex h-14 w-full cursor-not-allowed items-center rounded-2xl border border-border bg-muted/10 px-5 text-sm font-bold text-muted-foreground">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleProfileUpdate}
                      disabled={
                        updateLoading || !newName || newName === user?.name
                      }
                      className="flex h-14 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {updateLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Update Profile
                    </button>
                  </div>
                </div>
              )}

              {(active === "payments" || active === "messages") && (
                <DynamicPaymentHistory role="STUDENT" />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}