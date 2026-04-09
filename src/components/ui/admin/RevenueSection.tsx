import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

type RevenueSectionProps = {
  summary: {
    revenue30Days: number;
    previous30DaysRevenue: number;
    platformFees: number;
    tutorPayouts: number;
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const clampPercentage = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
};

export default function RevenueSection({ summary }: RevenueSectionProps) {
  const revenue30Days = Number(summary?.revenue30Days ?? 0);
  const previous30DaysRevenue = Number(summary?.previous30DaysRevenue ?? 0);
  const platformFees = Number(summary?.platformFees ?? 0);
  const tutorPayouts = Number(summary?.tutorPayouts ?? 0);

  const growth =
    previous30DaysRevenue > 0
      ? ((revenue30Days - previous30DaysRevenue) / previous30DaysRevenue) * 100
      : revenue30Days > 0
      ? 100
      : 0;

  const isPositive = growth >= 0;
  const absGrowth = Math.abs(growth);

  const totalDistribution = platformFees + tutorPayouts;
  const platformFeePercent =
    totalDistribution > 0 ? clampPercentage((platformFees / totalDistribution) * 100) : 0;
  const tutorPayoutPercent =
    totalDistribution > 0 ? clampPercentage((tutorPayouts / totalDistribution) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">Revenue (30 days)</h3>
          <p className="text-sm text-muted-foreground">
            Fully dynamic from booking payments
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-5 w-5" />
        </div>
      </div>

      <div className="mb-3 text-4xl font-black tracking-tight text-foreground xl:text-5xl">
        {formatCurrency(revenue30Days)}
      </div>

      <div
        className={`mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
          isPositive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>
          {isPositive ? "+" : "-"}
          {absGrowth.toFixed(1)}% vs previous 30 days
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Platform fees ({platformFeePercent.toFixed(0)}%)
            </span>
            <span className="font-bold text-foreground">
              {formatCurrency(platformFees)}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${platformFeePercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Tutor payouts ({tutorPayoutPercent.toFixed(0)}%)
            </span>
            <span className="font-bold text-foreground">
              {formatCurrency(tutorPayouts)}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/40 transition-all duration-500"
              style={{ width: `${tutorPayoutPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}