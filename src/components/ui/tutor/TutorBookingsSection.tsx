"use client";
import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  getTutorBookings,
  type TutorBooking,
} from "@/services/tutor";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  REJECTED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function TutorBookingsSection() {
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getTutorBookings(page, 8);
        if (res.success && res.data?.data) {
          setBookings(res.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Student Bookings
          </h2>
          {pendingCount > 0 && (
            <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5">
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No bookings yet
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition"
            >
              <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary font-bold text-sm flex items-center justify-center shrink-0">
                {b.studentName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{b.studentName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {b.startTime} – {b.endTime}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold shrink-0 ${
                  STATUS_STYLES[b.status] || "bg-muted text-muted-foreground"
                }`}
              >
                {b.status}
              </span>
              {b.status === "PENDING" && (
                <button className="shrink-0 rounded-lg bg-primary text-white px-3 py-1.5 text-xs font-bold hover:opacity-90 transition">
                  Respond
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">Page {page}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg border border-border text-xs font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
