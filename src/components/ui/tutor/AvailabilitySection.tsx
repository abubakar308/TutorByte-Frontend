"use client";
import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";

export default function AvailabilitySection() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="font-bold">Weekly Schedule</h3>
        <button className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold">
            <Plus className="h-4 w-4" /> Add New Slot
        </button>
      </div>
      <div className="divide-y divide-border">
        {days.map(day => (
          <div key={day} className="p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-32 font-bold text-sm text-muted-foreground">{day}</div>
            <div className="flex-1 flex flex-wrap gap-3">
               <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-xl border border-border group">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium">09:00 AM - 11:00 AM</span>
                  <button className="ml-2 text-rose-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-3.5 w-3.5" /></button>
               </div>
               {/* Add more slots mapping here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}