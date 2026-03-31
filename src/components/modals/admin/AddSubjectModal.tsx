"use client";
import { useState } from "react";
import { X, Save } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
}

export default function AddSubjectModal({ onClose, initialData, onSuccess }: ModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // এখানে আপনার API কল হবে (POST/PATCH)
      // await saveSubject({ name, icon });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-bold">{initialData ? "Edit Subject" : "Add New Subject"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Mathematics"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Icon (Emoji)</label>
            <input 
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. 📐"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save className="h-4 w-4" /> Save Subject</>}
          </button>
        </form>
      </div>
    </div>
  );
}