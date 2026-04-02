"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  BookOpen, Search, Calendar, 
  Clock, DollarSign, Loader2, ChevronLeft, ChevronRight 
} from "lucide-react";
import { getAdminBookings } from "@/services/booking";
import { toast } from "sonner";

// স্ট্যাটাস কালার কোড
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function BookingsSection() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ডাটা ফেচ করার মূল ফাংশন (useCallback দিয়ে মোড়ানো হয়েছে ESLint এরর এড়াতে)
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      // API যদি সব ডাটার জন্য খালি স্ট্রিং চায়
     const apiStatus = filterStatus === "ALL" ? undefined : filterStatus;
      
      const res = await getAdminBookings(page, 10, apiStatus);
      console.log("API Result:", res.data);
      
      if (res.success && res.data) {
        // res.data as any ব্যবহার করা হয়েছে টাইপ এরর এড়াতে
        const data = res.data as any;
        setBookings(data.bookings || []);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tutor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // এপিআই সার্ভার সাইড ফিল্টার করলেও ক্লায়েন্ট সাইড চেক রাখা নিরাপদ
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* ── Header & Filters ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Bookings
          </h2>
          <p className="text-sm text-muted-foreground">Monitor all tutoring sessions</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex items-center rounded-2xl border border-border bg-card px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent text-sm font-medium outline-none w-40 md:w-60"
            />
          </div>

          {/* Status Filter */}
          <select 
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1); // ফিল্টার বদলালে প্রথম পেজে নিয়ে যাবে
            }}
            className="rounded-2xl border border-border bg-card px-4 py-2 text-sm font-bold outline-none cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-4">Student & Tutor</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{b.student?.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          to <span className="font-semibold text-primary">{b.tutor?.user?.name}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <Calendar className="h-3 w-3 text-primary" />
                          {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                          <Clock className="h-3 w-3" />
                          {b.startTime} - {b.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-black text-sm text-foreground">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        {b.totalPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tight ${STATUS_STYLES[b.status] || "bg-gray-100"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-black text-primary hover:underline underline-offset-4">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/20" />
            <p className="mt-4 font-bold text-muted-foreground">No bookings matching your criteria</p>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-8 py-4 bg-muted/20">
            <p className="text-xs font-bold text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-card disabled:opacity-30 transition-all active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-card disabled:opacity-30 transition-all active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}