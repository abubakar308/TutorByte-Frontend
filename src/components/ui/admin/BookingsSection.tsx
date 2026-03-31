"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import {
  getAdminBookings,
  type AdminBooking,
} from "@/services/booking";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function BookingsSection() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await getAdminBookings(1, 10);
        if (res.success && res.data?.data) {
          setBookings(res.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Bookings
        </h2>
        <span className="text-xs text-muted-foreground">{bookings.length} total</span>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No bookings found</div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {b.studentName} → {b.tutorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {b.subject} · {b.date}
                </p>
              </div>

              <span className={`rounded-full px-2.5 py-1 text-xs font-bold shrink-0 ${STATUS_STYLES[b.status]}`}>
                {b.status}
              </span>

              <p className="font-bold text-sm shrink-0">${b.amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}