"use client";
import { useEffect, useState } from "react";
import { BarChart3, DollarSign } from "lucide-react";

interface RevenueData {
  platformFees: number;
  tutorPayouts: number;
  totalRevenue: number;
}

export default function RevenueSection() {
  const [data, setData] = useState<RevenueData>({
    platformFees: 584,
    tutorPayouts: 5256,
    totalRevenue: 5840,
  });

  const platformFeesPct = (data.platformFees / data.totalRevenue) * 100;
  const tutorPayoutsPct = (data.tutorPayouts / data.totalRevenue) * 100;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Revenue (30 days)
        </h3>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-3xl font-black mb-1">${data.totalRevenue}</p>
      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-5">
        +12% vs last month
      </p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Platform fees (10%)</span>
            <span className="font-bold">${data.platformFees}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${platformFeesPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Tutor payouts (90%)</span>
            <span className="font-bold">${data.tutorPayouts}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/30 transition-all"
              style={{ width: `${tutorPayoutsPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
