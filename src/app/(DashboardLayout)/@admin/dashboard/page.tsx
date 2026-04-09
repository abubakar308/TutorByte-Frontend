"use client";

type RevenueSectionProps = {
  summary: {
    revenue30Days: number;
    previous30DaysRevenue: number;
    platformFees: number;
    tutorPayouts: number;
  };
};

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  ShieldCheck,
  LogOut,
  Bell,
  Menu,
  X,
  UserCheck,
  Activity,
  Plus,
  GraduationCap,
  Globe,
  UserPlus,
  Star,
  User,
  Sun,
  Moon,
  Settings2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getAdminDashboardStats, getAdminBookings, AdminDashboardStats, AdminBookingsPayload } from "@/services/admin";

// UI Sections
import UsersSection from "@/components/ui/admin/UsersSection";
import PendingTutorsSection from "@/components/ui/admin/PendingTutorsSection";
import RevenueSection from "@/components/ui/admin/RevenueSection";
import PaymentsSection from "@/components/ui/admin/PaymentsSection";
import BookingsSection from "@/components/ui/admin/BookingsSection";
import SubjectsSection from "@/components/ui/admin/SubjectsSection";
import LanguagesSection from "@/components/ui/admin/LanguageSection";

type ChartItem = {
  label: string;
  bookings: number;
  revenue: number;
};

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "users", icon: Users, label: "Students" },
  { id: "tutors", icon: UserCheck, label: "Teachers" },
  { id: "bookings", icon: BookOpen, label: "Bookings" },
  { id: "payments", icon: CreditCard, label: "Payments" },
  { id: "subjects", icon: GraduationCap, label: "Subjects" },
  { id: "languages", icon: Globe, label: "Languages" },
  { id: "admins", icon: Settings2, label: "Admins" },
] as const;

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [bookingsData, setBookingsData] = useState<AdminBookingsPayload | null>(null);

  const [statsLoading, setStatsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const statsRes = await getAdminDashboardStats();

        if (statsRes?.success && statsRes?.data) {
          setStats(statsRes.data);
        } else {
          setStats(null);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const bookingsRes = await getAdminBookings();

        console.log("admin bookings response:", bookingsRes);

        if (bookingsRes?.success && bookingsRes?.data?.bookings) {
          setBookingsData(bookingsRes.data);
        } else {
          setBookingsData({ bookings: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } });
        }
      } catch (error) {
        console.error("Failed to fetch admin bookings:", error);
        setBookingsData({ bookings: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } });
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchStats();
    fetchBookings();
  }, []);

  const loading = statsLoading || bookingsLoading;

  const averageRating = stats?.averageRating?._avg?.averageRating ?? 0;
  const totalRevenue = Number(stats?.totalRevenue ?? 0);

  const totalPayments = bookingsData?.bookings?.filter((booking) => booking.payment).length ?? 0;
  const paidPayments =
    bookingsData?.bookings?.filter((booking) => booking.payment?.status === "PAID").length ?? 0;

  const pendingCount =
    bookingsData?.bookings?.filter((booking) => booking.status === "PENDING").length ?? 0;

  const platformStats = [
    {
      key: "students",
      label: "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      change: "Registered Users",
      positive: true,
    },
    {
      key: "teachers",
      label: "Total Teachers",
      value: stats?.totalTutors ?? 0,
      icon: UserCheck,
      change: "Approved Tutors",
      positive: true,
    },
    {
      key: "bookings",
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: BookOpen,
      change: "All Sessions",
      positive: null,
    },
    {
      key: "revenue",
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: Activity,
      change: "Paid Earnings",
      positive: true,
    },
    {
      key: "rating",
      label: "Average Rating",
      value: Number(averageRating).toFixed(1),
      icon: Star,
      change: "Tutor Reviews",
      positive: true,
    },
    {
      key: "payments",
      label: "Total Payments",
      value: totalPayments,
      icon: CreditCard,
      change: `${paidPayments} Paid`,
      positive: true,
    },
  ];

  const chartData: ChartItem[] = useMemo(() => {
  const bookings = bookingsData?.bookings ?? [];
  if (!bookings.length) return [];

  const grouped = bookings.reduce<
    Record<string, { sortKey: string; label: string; bookings: number; revenue: number }>
  >((acc, booking) => {
    const date = new Date(booking.bookingDate);
    const sortKey = date.toISOString().split("T")[0];

    if (!acc[sortKey]) {
      acc[sortKey] = {
        sortKey,
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        bookings: 0,
        revenue: 0,
      };
    }

    acc[sortKey].bookings += 1;
    acc[sortKey].revenue += Number(booking.totalPrice ?? 0);

    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ label, bookings, revenue }) => ({
      label,
      bookings,
      revenue,
    }));
}, [bookingsData]);

  const revenueSummary = useMemo(() => {
    const bookings = bookingsData?.bookings ?? [];
    let revenue30Days = 0;
    let previous30DaysRevenue = 0;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    bookings.forEach((booking) => {
      const bDate = new Date(booking.bookingDate);
      const amount = Number(booking.totalPrice ?? 0);
      if (bDate >= thirtyDaysAgo) {
        revenue30Days += amount;
      } else if (bDate >= sixtyDaysAgo && bDate < thirtyDaysAgo) {
        previous30DaysRevenue += amount;
      }
    });

    return {
      revenue30Days,
      previous30DaysRevenue,
      platformFees: revenue30Days * 0.1,
      tutorPayouts: revenue30Days * 0.9,
    };
  }, [bookingsData]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sideOpen ? "w-60" : "w-[68px]"
        } flex shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-all duration-300`}
      >
        <div className="flex h-[68px] items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {sideOpen && (
              <span className="whitespace-nowrap text-[16px] font-black tracking-tight">
                TutorByte
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active === id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sideOpen && <span className="flex-1 text-left whitespace-nowrap">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/20">
            <LogOut className="h-4 w-4 shrink-0" />
            {sideOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSideOpen((o) => !o)}
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition"
            >
              {sideOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[15px] font-bold capitalize">{active.replace("-", " ")}</p>
              <p className="text-xs text-muted-foreground">TutorByte Control Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {["subjects", "languages", "admins"].includes(active) && (
              <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add {active.slice(0, -1)}
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="relative h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition text-muted-foreground hover:text-foreground"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button className="relative h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              {pendingCount > 0 && (
                <span className="absolute right-1.5 top-1.5 min-w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center px-1">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="h-9 w-9 rounded-xl border border-border flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition"
              >
                <User className="h-4 w-4" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-bold">Admin Profile</p>
                      <p className="text-xs text-muted-foreground">Manage your account</p>
                    </div>

                    <button
                      onClick={() => {
                        setActive("admins");
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition"
                    >
                      Profile
                    </button>

                    <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition">
                      Settings
                    </button>

                    <button className="w-full px-4 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition">
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {active === "overview" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 mb-6">
                {platformStats.map(({ key, label, value, icon: Icon, change, positive }) => (
                  <div key={key} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          positive
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {change}
                      </span>
                    </div>
                    <p className="text-2xl font-black tracking-tight">
                      {loading ? "..." : value}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <DashboardChart data={chartData} loading={loading} />

              <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <PendingTutorsSection />
                <RevenueSection summary={revenueSummary} />
              </div>
            </>
          )}

          <div className="transition-all duration-300">
            {active === "users" && <UsersSection />}
            {active === "tutors" && <PendingTutorsSection />}
            {active === "bookings" && <BookingsSection />}
            {active === "payments" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <PaymentsSection />
                <RevenueSection summary={revenueSummary} />
              </div>
            )}
            {active === "subjects" && <SubjectsSection />}
            {active === "languages" && <LanguagesSection />}
            {active === "admins" && <AdminsManagement totalUsers={stats?.totalUsers ?? 0} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardChart({
  data,
  loading,
}: {
  data: ChartItem[];
  loading: boolean;
}) {
  return (
    <div className="mb-6 w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Revenue & Bookings Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Real dynamic analytics from booking data
        </p>
      </div>

      <div className="h-[340px] w-full">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barGap={18}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity={0.35}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />

              {/* Revenue axis */}
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                width={45}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />

              {/* Bookings axis */}
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={35}
                allowDecimals={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />

              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  color: "var(--foreground)",
                }}
                formatter={(value, name) => {
                  if (name === "Revenue") return [`$${value}`, "Revenue"];
                  if (name === "Bookings") return [value, "Bookings"];
                  return [value, name];
                }}
              />

              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Revenue"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
                maxBarSize={42}
              />

              <Bar
                yAxisId="right"
                dataKey="bookings"
                name="Bookings"
                fill="var(--ring)"
                radius={[8, 8, 0, 0]}
                maxBarSize={26}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground">
            <p>No analytics data available</p>
            <p className="mt-2 text-xs">Check bookings API response and chart mapping</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminsManagement({ totalUsers }: { totalUsers: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-card rounded-3xl border-2 border-dashed border-border">
      <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
        <UserPlus className="h-10 w-10" />
      </div>
      <h3 className="font-bold text-xl mb-2">Administrator Management</h3>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm text-center">
        Total platform users: {totalUsers}
      </p>
      <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
        Create New Admin Account
      </button>
    </div>
  );
}