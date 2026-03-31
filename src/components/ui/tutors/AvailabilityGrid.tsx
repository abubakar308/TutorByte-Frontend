"use client"

import { Clock, Calendar, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// API থেকে আসা ৩ অক্ষরের দিনগুলোকে পূর্ণ নামে ম্যাপ করার জন্য
const DAY_MAP: Record<string, string> = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

// প্রদর্শনের সিরিয়াল ঠিক রাখার জন্য
const DAYS_ORDER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function AvailabilityGrid({ availabilities }: { availabilities: any[] }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // সময়কে ১২ ঘণ্টার ফরম্যাটে (AM/PM) দেখানোর ফাংশন
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  };

  // দিন অনুযায়ী ডাটা গ্রুপ করা
  const groupedSlots = DAYS_ORDER.map((dayCode) => ({
    dayCode,
    dayName: DAY_MAP[dayCode],
    slots: availabilities?.filter((a) => a.dayOfWeek === dayCode && a.isActive) || [],
  }));

  return (
    <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm sm:p-10">
      {/* Header Section */}
      <div className="mb-10 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Weekly Schedule</h2>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            Select a preferred time slot
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary shadow-inner">
          <Calendar className="h-7 w-7" />
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 gap-4">
        {groupedSlots.map(({ dayCode, dayName, slots }) => (
          <div
            key={dayCode}
            className="group flex flex-col gap-4 rounded-3xl border border-border/50 bg-background/30 p-5 transition-all hover:border-primary/30 hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-8"
          >
            {/* Day Label */}
            <div className="w-24 shrink-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">
                {dayName.slice(0, 3)}
              </p>
              <p className="hidden text-[10px] font-bold text-muted-foreground/40 sm:block">
                {dayName}
              </p>
            </div>

            {/* Time Slots */}
            <div className="flex flex-1 flex-wrap gap-3">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`group/btn relative flex items-center gap-2 overflow-hidden rounded-2xl border px-5 py-3 text-sm font-black transition-all duration-300 ${
                      selectedSlot === slot.id
                        ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.03]"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    {selectedSlot === slot.id ? (
                      <CheckCircle2 className="h-4 w-4 animate-in zoom-in duration-300" />
                    ) : (
                      <Clock className="h-4 w-4 text-primary opacity-40 group-hover/btn:opacity-100" />
                    )}
                    <span>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  <Info className="h-3 w-3" />
                  Not Available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-10 flex items-center justify-center gap-3 rounded-3xl bg-muted/30 p-5 border border-dashed border-border">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">
          Timezone: Asia/Dhaka (GMT+6) • Instant Confirmation
        </p>
      </div>
    </div>
  );
}