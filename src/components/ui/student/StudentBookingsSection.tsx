"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Clock, AlertCircle, Calendar, DollarSign, Video,
  Star, X, Loader2, ExternalLink, ChevronLeft, ChevronRight,
  Copy, CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { createReview, getStudentBookings } from "@/services/student"; // ইমপোর্ট নিশ্চিত করা হয়েছে
import PaymentModal from "./PaymentModal";

// ─────────────────────────────────────────────────────────────
//  TYPES 
// ─────────────────────────────────────────────────────────────

interface Booking {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  totalPrice: number;
  meetingLink?: string | null;
  createdAt: string;
  tutor: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string | null;
    };
  };
  payment?: {
    id: string;
    status: "PENDING" | "PAID" | "REFUNDED" | "FAILED";
    amount: number;
    paymentMethod: string;
    transactionId?: string;
  } | null;
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "Pending",   cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
  ACCEPTED:  { label: "Accepted",  cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
  COMPLETED: { label: "Completed", cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" },
  CANCELLED: { label: "Cancelled", cls: "bg-muted text-muted-foreground border-border" },
  REJECTED:  { label: "Rejected",  cls: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800" },
};

const PAYMENT_MAP: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Unpaid",   cls: "text-amber-600" },
  PAID:     { label: "Paid ✓",   cls: "text-emerald-600 dark:text-emerald-400" },
  REFUNDED: { label: "Refunded", cls: "text-muted-foreground" },
  FAILED:   { label: "Failed",   cls: "text-rose-500" },
};

// ─────────────────────────────────────────────────────────────
//  REVIEW MODAL
// ─────────────────────────────────────────────────────────────

function ReviewModal({ booking, onClose, onDone }: { booking: Booking; onClose: () => void; onDone: () => void; }) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];

 const handleSubmit = async () => {
  if (comment.trim().length < 10) {
    toast.error("Please write at least 10 characters.");
    return;
  }
  
  setLoading(true);
  try {
    const response = await createReview(
      booking.id, // bookingId
      booking.tutor.id, // tutorId
      rating,     // rating
      comment     // comment
    );

    if (response.success) {
      toast.success("Review submitted!");
      onDone();
      onClose();
    } else {
      toast.error(response.message || "Failed to submit review.");
    }
  } catch (err: any) {
    toast.error(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[2rem] border border-border bg-card shadow-2xl animate-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-black text-foreground">Rate your session</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-muted/40">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
              {booking.tutor.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-foreground">{booking.tutor.user.name}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-bold">
                {new Date(booking.bookingDate).toLocaleDateString()} · {booking.startTime}
              </p>
            </div>
          </div>
          <div className="mb-5 text-center">
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}>
                  <Star className={`h-9 w-9 transition-colors ${(hovered || rating) >= n ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-foreground h-5">{LABELS[hovered || rating]}</p>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Feedback..."
            rows={4}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/5 transition"
          />
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-3 font-bold hover:bg-muted rounded-2xl transition">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary text-white py-3 font-bold rounded-2xl flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MEETING LINK DISPLAY
// ─────────────────────────────────────────────────────────────

function MeetingLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 animate-in slide-in-from-top-2">
      <Video className="h-4 w-4 text-primary shrink-0" />
      <p className="flex-1 text-xs font-semibold text-primary truncate">{link}</p>
      <button onClick={handleCopy} className="text-primary hover:opacity-70 transition">
        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <a href={link} target="_blank" rel="noreferrer" className="text-primary hover:opacity-70 transition"><ExternalLink className="h-4 w-4" /></a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  BOOKING CARD
// ─────────────────────────────────────────────────────────────

function BookingCard({ booking, onRefresh }: { booking: Booking; onRefresh: () => void; }) {
  const [showReview, setShowReview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const status = STATUS_MAP[booking.status] ?? STATUS_MAP.PENDING;
  const payment = booking.payment;
  const paymentInfo = payment ? PAYMENT_MAP[payment.status] : null;

  const needsPayment = booking.status === "ACCEPTED" && (!payment || payment.status === "PENDING" || payment.status === "FAILED");

  return (
    <>
      <div className="group rounded-[2rem] border border-border bg-card p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center shrink-0 border border-primary/5">
              {booking.tutor.user.avatarUrl ? (
                <img src={booking.tutor.user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-black text-xl text-primary">{booking.tutor.user.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="font-black text-foreground">{booking.tutor.user.name}</h4>
              <p className="text-xs text-muted-foreground">{booking.tutor.user.email}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase border ${status.cls}`}>
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
            <Clock className="h-3.5 w-3.5" />
            {booking.startTime} - {booking.endTime}
          </div>
          <div className="ml-auto flex items-center gap-1 font-black text-lg text-emerald-600">
             <DollarSign className="h-4 w-4" />{booking.totalPrice}
          </div>
        </div>

        {paymentInfo && (
          <div className={`text-[10px] font-black uppercase mb-3 px-3 py-1 rounded-lg w-fit ${paymentInfo.cls} bg-current/5`}>
            Payment: {paymentInfo.label}
          </div>
        )}

        {booking.status === "ACCEPTED" && booking.meetingLink && <MeetingLinkButton link={booking.meetingLink} />}

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/60">
          {needsPayment && (
            <button onClick={() => setShowPayment(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white hover:opacity-90 transition-all">
              <DollarSign className="h-4 w-4" /> Pay Now
            </button>
          )}

          {booking.status === "COMPLETED" && (
            <button onClick={() => setShowReview(true)} className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-xs font-black hover:bg-muted transition">
              <Star className="h-4 w-4" /> Review
            </button>
          )}
        </div>
      </div>

      {showReview && <ReviewModal booking={booking} onClose={() => setShowReview(false)} onDone={onRefresh} />}
      {showPayment && (
        <PaymentModal 
          booking={booking} 
          onClose={() => setShowPayment(false)} 
          onSuccess={() => { onRefresh(); toast.success("Payment submitted!"); }} 
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function StudentBookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudentBookings(page, 10, statusFilter === "ALL" ? "" : statusFilter);
      if (res.success) {
        const raw = res.data as any;
        const list = Array.isArray(raw) ? raw : raw?.data || [];
        setBookings(list);
        setTotalPages(raw?.meta?.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight">Your Sessions</h3>
          <p className="text-xs text-muted-foreground font-bold uppercase">Track your learning journey</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-black outline-none cursor-pointer hover:border-primary/40 transition"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => <div key={i} className="h-48 rounded-[2rem] bg-muted animate-pulse" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10">
          <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-bold text-muted-foreground">No bookings found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => <BookingCard key={b.id} booking={b} onRefresh={fetchBookings} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 rounded-xl border border-border disabled:opacity-30"><ChevronLeft className="h-5 w-5"/></button>
          <span className="text-xs font-black">PAGE {page} OF {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 rounded-xl border border-border disabled:opacity-30"><ChevronRight className="h-5 w-5"/></button>
        </div>
      )}
    </div>
  );
}