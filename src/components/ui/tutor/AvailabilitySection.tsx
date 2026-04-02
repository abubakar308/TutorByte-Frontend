"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, X, Loader2, CalendarCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { 
  createAvailability, 
  deleteAvailability, 
  getTutorProfile
} from "@/services/tutor"; 

const DAYS_ORDER = [
  { label: "Sunday", value: "SUN" },
  { label: "Monday", value: "MON" },
  { label: "Tuesday", value: "TUE" },
  { label: "Wednesday", value: "WED" },
  { label: "Thursday", value: "THU" },
  { label: "Friday", value: "FRI" },
  { label: "Saturday", value: "SAT" },
];

export default function AvailabilitySection() {
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: "SUN",
    startTime: "10:00",
    endTime: "11:00",
    isActive: true,
  });


  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const res = await getTutorProfile();
      if (res.success && res.data) {
        setAvailabilities(res.data.availabilities || []);
      } else {
        toast.error(res.message || "Failed to load schedules");
      }

    } catch (error) {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

 const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newSlot.startTime >= newSlot.endTime) {
      return toast.error("End time must be after start time");
    }

    setSubmitting(true);
    try {
      // ডাটাকে "slots" অ্যারের ভেতরে র‍্যাপ (Wrap) করে পাঠানো হচ্ছে
      const payload = {
        slots: [
          {
            dayOfWeek: newSlot.dayOfWeek,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
          }
        ]
      };

      const res = await createAvailability(payload as any); 
      
      if (res.success) {
        toast.success("New slot added successfully!");
        setIsModalOpen(false);
        fetchAvailabilities(); 
        setNewSlot({ ...newSlot, startTime: "10:00", endTime: "11:00" });
      } else {
        toast.error(res.message || "Could not add slot");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast.promise(async () => {
      const res = await deleteAvailability(id);
      if (res.success) {
        setAvailabilities((prev) => prev.filter((a) => a.id !== id));
        return "Slot deleted";
      }
      throw new Error(res.message);
    }, {
      loading: 'Deleting slot...',
      success: (data) => data,
      error: (err) => err.message || "Delete failed",
    });
  };

  return (
    <div className="rounded-[2.5rem] border border-border bg-card shadow-sm overflow-hidden animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="p-8 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
             <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Schedule Manager</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Manage your teaching windows</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Create Slot
        </button>
      </div>

      {/* Content */}
      <div className="divide-y divide-border/50">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center gap-3">
             <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
             <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">Loading Schedule...</p>
          </div>
        ) : (
          DAYS_ORDER.map(({ label, value }) => {
            const daySlots = availabilities.filter((a) => a.dayOfWeek === value);
            return (
              <div key={value} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-muted/10 transition-colors">
                <div className="w-32 shrink-0">
                   <p className="font-black text-xs uppercase tracking-[0.2em] text-primary">{label.slice(0,3)}</p>
                   <p className="text-[10px] font-bold text-muted-foreground/30">{label}</p>
                </div>
                
                <div className="flex-1 flex flex-wrap gap-3">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="flex items-center gap-3 bg-background border border-border px-4 py-2.5 rounded-2xl group hover:border-primary/40 transition-all shadow-sm"
                      >
                        <Clock className="h-3.5 w-3.5 text-primary opacity-50" />
                        <span className="text-sm font-bold">{slot.startTime} - {slot.endTime}</span>
                        <button 
                          onClick={() => handleDelete(slot.id)}
                          className="ml-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest py-2">
                       <AlertCircle className="h-3 w-3" /> No Classes Scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- Create Slot Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
               <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Plus className="h-5 w-5" />
               </div>
               <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
                  <X className="h-5 w-5" />
               </button>
            </div>

            <h4 className="text-2xl font-black tracking-tight mb-2">New Time Slot</h4>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">Define your available hours</p>

            <form onSubmit={handleAddSlot} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Weekday</label>
                <select 
                  className="w-full h-14 bg-muted/40 border border-border rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({...newSlot, dayOfWeek: e.target.value})}
                >
                  {DAYS_ORDER.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Starts At</label>
                  <input 
                    type="time" 
                    className="w-full h-14 bg-muted/40 border border-border rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ends At</label>
                  <input 
                    type="time" 
                    className="w-full h-14 bg-muted/40 border border-border rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-bold text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}