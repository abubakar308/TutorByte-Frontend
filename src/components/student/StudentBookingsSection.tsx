"use client";
import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import {
  getStudentBookings,
  type StudentBooking,
} from "@/services/student";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function StudentBookingsSection() {
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getStudentBookings(page, 10);
        if (res.success && res.data?.data) {
          setBookings(res.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2">
          <Clock className="h-4 w-4" /> Your Sessions
        </h2>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading sessions...</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center">
            <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No sessions booked yet</p>
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-start gap-4 px-6 py-4 hover:bg-muted/40 transition"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                {b.tutorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{b.tutorName}</p>
                <p className="text-xs text-muted-foreground">{b.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "No date"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    STATUS_STYLES[b.status] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {b.status}
                </span>
                <span className="font-bold text-sm">${b.totalPrice}</span>
              </div>
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
