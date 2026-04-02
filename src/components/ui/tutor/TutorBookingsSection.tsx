"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Calendar, Clock, User, CheckCircle2, XCircle, 
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  CreditCard, Wallet,
  Video
} from "lucide-react";
import { getTutorBookings, updateBookingStatus } from "@/services/tutor";
import { approvePayment } from "@/services/payment"; // পেমেন্ট অ্যাপ্রুভ সার্ভিস
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
  REJECTED: "bg-muted text-muted-foreground border-border",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "text-emerald-600 bg-emerald-50 border-emerald-100",
  PENDING: "text-amber-600 bg-amber-50 border-amber-100",
  FAILED: "text-rose-600 bg-rose-50 border-rose-100",
};

export default function TutorBookingsSection() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTutorBookings(page, 6);
      if (res.success) {
        const rawData = res.data as any;
        const list = Array.isArray(rawData) ? rawData : rawData?.data || [];
        setBookings(list);
        const total = rawData?.meta?.total || rawData?.total || list.length;
        setTotalPages(Math.ceil(total / 6) || 1);
      }
    } catch (err: any) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // --- Handlers ---

  const handleAccept = async (id: string) => {
    toast.promise(updateBookingStatus(id, { status: "ACCEPTED" }), {
      loading: "Accepting booking...",
      success: () => { fetchBookings(); return "Booking accepted!"; },
      error: "Error accepting booking.",
    });
  };

  const handleApprovePayment = async (bookingId: string) => {
    toast.promise(approvePayment(bookingId), {
      loading: "Verifying payment...",
      success: () => { fetchBookings(); return "Payment approved & Link generated!"; },
      error: "Failed to approve payment.",
    });
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await updateBookingStatus(id, { status: "COMPLETED" });
      if (res.success) {
        toast.success("Session completed");
        fetchBookings();
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary"><Calendar className="h-5 w-5" /></div>
          <div>
            <h2 className="font-black text-lg tracking-tight">Booking Requests</h2>
            <p className="text-xs text-muted-foreground">Manage schedule & payments</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/60">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm font-medium">Loading requests...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center"><AlertCircle className="mx-auto h-8 w-8 opacity-20 mb-2"/><p className="text-sm text-muted-foreground">No bookings found.</p></div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="group flex flex-col lg:flex-row lg:items-center gap-4 px-6 py-5 hover:bg-muted/30 transition-colors">
              
              {/* Student & Session Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <span className="font-black text-secondary">{b.student?.user?.name?.charAt(0) || "S"}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{b.student?.user?.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 text-[10px] font-bold text-muted-foreground uppercase mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.startTime} - {b.endTime}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(b.bookingDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status Badge & Detail */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                      <span className="text-xs font-black text-foreground">${b.totalPrice}</span>
                   </div>
                   {b.payment ? (
                      <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-lg border w-fit ${PAYMENT_STATUS_STYLES[b.payment.status]}`}>
                        <Wallet className="h-3 w-3" />
                        {b.payment.status === "PAID" ? "PAYMENT VERIFIED" : `PENDING: ${b.payment.paymentMethod}`}
                      </div>
                   ) : (
                      <div className="text-[9px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle className="h-3 w-3"/> NO PAYMENT RECORD</div>
                   )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Step 1: Accept Booking */}
                  {b.status === "PENDING" && (
                    <button onClick={() => handleAccept(b.id)} className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white hover:opacity-90 transition-all">
                      Accept Request
                    </button>
                  )}

                  {/* Step 2: Verify Manual Payment (bKash/Nagad) */}
                  {b.status === "ACCEPTED" && b.payment?.status === "PENDING" && (
                    <div className="flex items-center gap-2 bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                      <div className="px-2">
                        <p className="text-[9px] font-black text-amber-700 uppercase">Verify TxID</p>
                        <p className="text-[11px] font-bold font-mono">{b.payment.transactionId}</p>
                      </div>
                      <button 
                        onClick={() => handleApprovePayment(b.id)}
                        className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors"
                        title="Approve Payment"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

              {/* Step 3: Join Meeting & Mark Done */}
{b.status === "ACCEPTED" && b.payment?.status === "PAID" && (
  <div className="flex items-center gap-2">
    {/* Join Meeting Button */}
    <a 
      href={`https://meet.jit.si/TutorByte-${b.id}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
    >
      <Video className="h-3.5 w-3.5" />
      Join Class
    </a>

    {/* Mark Done Button */}
    <button 
      onClick={() => handleComplete(b.id)} 
      className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition-all"
    >
      <CheckCircle2 className="h-3.5 w-3.5" /> 
      Mark Done
    </button>
  </div>
)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-border bg-card disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-border bg-card disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}