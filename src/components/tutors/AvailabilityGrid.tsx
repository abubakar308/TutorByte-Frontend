import { Availability, DayOfWeek } from "@/types/tutor";
import { Calendar, Clock, Info } from "lucide-react";

interface AvailabilityGridProps {
  availabilities: Availability[];
}

const DAYS: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

export default function AvailabilityGrid({ availabilities }: AvailabilityGridProps) {
  // Group by day
  const grouped = DAYS.map((day) => ({
    day,
    slots: availabilities.filter((a) => a.dayOfWeek === day && a.isActive),
  }));

  return (
    <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Weekly Availability
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a time slot that fits your schedule
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-4">
        {grouped.map(({ day, slots }) => (
          <div
            key={day}
            className="group flex flex-col gap-3 rounded-3xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/[0.02] sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="min-w-[120px]">
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </span>
            </div>

            <div className="flex flex-1 flex-wrap gap-2">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <button
                    key={slot.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                  No slots available
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-muted/30 p-4">
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          All times are shown in your local timezone. Availability may change
          based on previous bookings.
        </p>
      </div>
    </div>
  );
}
