export function TutorCardSkeleton() {
  return (
    <div className="flex h-full min-h-[420px] w-full animate-pulse flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
      <div className="h-52 w-full bg-muted" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="mt-2 h-4 w-24 rounded bg-muted" />
            <div className="mt-3 flex gap-2">
              <div className="h-5 w-16 rounded bg-muted" />
              <div className="h-5 w-16 rounded bg-muted" />
            </div>
          </div>
          <div className="h-8 w-14 rounded-full bg-muted" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-4/5 rounded bg-muted" />
        </div>

        <div className="mt-5 space-y-2 border-t border-border/70 pt-4">
          <div className="h-3 w-32 rounded bg-muted" />
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>

        <div className="mt-5 h-11 rounded-xl bg-muted" />
      </div>
    </div>
  );
}