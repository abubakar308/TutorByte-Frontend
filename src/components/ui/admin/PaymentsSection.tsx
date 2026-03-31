"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import {
  getAdminPayments,
  refundPayment,
  type AdminPayment,
} from "@/services/admin";

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  REFUNDED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function PaymentsSection() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAdminPayments(1, 10);
      if (res.success && res.data?.data) {
        setPayments(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId: string) => {
    try {
      setRefundingId(paymentId);
      const res = await refundPayment(paymentId);

      if (res.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId ? { ...p, status: "REFUNDED" } : p
          )
        );
      } else {
        alert(res.message || "Refund failed");
      }
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        <h3 className="font-bold text-sm">Recent Payments</h3>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No payments found</div>
        ) : (
          payments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">
                  {p.studentName} → {p.tutorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.gateway} · {p.createdAt}
                </p>
              </div>

              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0 ${STATUS_STYLES[p.status]}`}>
                {p.status}
              </span>

              <span className="font-black text-sm shrink-0">${p.amount}</span>

              {p.status === "PAID" && (
                <button
                  onClick={() => handleRefund(p.id)}
                  disabled={refundingId === p.id}
                  className="shrink-0 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition disabled:opacity-50"
                >
                  {refundingId === p.id ? "Refunding..." : "Refund"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}