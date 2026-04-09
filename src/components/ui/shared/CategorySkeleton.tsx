export default function CategoryCardSkeleton() {
  return (
    <div className="flex min-h-[250px] animate-pulse flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
      <div className="mb-6 h-14 w-14 rounded-xl bg-muted" />
      <div className="h-6 w-32 rounded bg-muted" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-4/6 rounded bg-muted" />
      </div>
      <div className="mt-auto pt-6">
        <div className="h-4 w-28 rounded bg-muted" />
      </div>
    </div>
  );
}