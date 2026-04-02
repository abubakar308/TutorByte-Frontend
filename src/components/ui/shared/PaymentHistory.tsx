"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  CreditCard, ArrowUpRight, ArrowDownLeft, 
  Search, Download, Loader2, Calendar, Hash
} from "lucide-react";
import { toast } from "sonner";
import { getPaymentHistory } from "@/services/payment"; // আপনার সার্ভিস ইমপোর্ট

interface Payment {
  id: string;
  amount: string | number;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED";
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
  booking: {
    student?: { user: { name: string } };
    tutor?: { user: { name: string } };
  };
}

export default function DynamicPaymentHistory({ role }: { role: "STUDENT" | "TUTOR" | "ADMIN" }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPaymentHistory();
      console.log("Payment History Response:", res);
      if (res.success) {
        setPayments(res.data);
      } else {
        toast.error(res.message || "Failed to load history");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "FAILED": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-border bg-muted/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            {role === "TUTOR" ? "Earnings" : role === "ADMIN" ? "Financial Records" : "My Payments"}
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
            {role === "ADMIN" ? "System-wide transactions" : "Your transaction history"}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
          <Download className="h-4 w-4" /> Export Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border text-left">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity & ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20 text-primary" /></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="py-20 text-center text-muted-foreground font-bold">No history available</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${role === 'TUTOR' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {role === 'TUTOR' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">
                          {role === "STUDENT" ? p.booking.tutor?.user?.name : p.booking.student?.user?.name}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                          <Hash className="h-3 w-3" /> {p.transactionId || "No Trx ID"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black bg-muted px-2.5 py-1 rounded-lg border border-border">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-sm">
                    {role === 'TUTOR' ? '+' : '-'}${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${getStatusColor(p.status)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      {p.status}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}