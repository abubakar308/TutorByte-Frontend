"use client";

import {
  type AdminDashboardStats,
  getAdminDashboardStats,
} from "@/services/admin";
import { ShieldCheck, Users, Star, BookOpen, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function StatsSection() {
  const [statsData, setStatsData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboardStats();

        if (res.success && res.data) {
          setStatsData(res.data);
        } else {
          setStatsData(null);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const avgRating =
    statsData?.averageRating?._avg?.averageRating != null
      ? Number(statsData.averageRating._avg.averageRating).toFixed(1)
      : "0.0";

  const stats = useMemo(() => {
    return [
      {
        label: "Verified Tutors",
        value: statsData?.totalTutors ?? 0,
        icon: ShieldCheck,
      },
      {
        label: "Active Students",
        value: statsData?.totalStudents ?? 0,
        icon: Users,
      },
      {
        label: "Average Rating",
        value: avgRating,
        icon: Star,
      },
      {
        label: "Total Bookings",
        value: statsData?.totalBookings ?? 0,
        icon: BookOpen,
      },
    ];
  }, [statsData, avgRating]);

  return (
    <section className="relative z-20 mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-primary/5 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:p-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-border/60 bg-background/75 p-4"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <div className="h-7 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-muted" />
              </article>
            ))
          : stats.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-background/75 p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                </article>
              );
            })}
      </div>
    </section>
  );
}