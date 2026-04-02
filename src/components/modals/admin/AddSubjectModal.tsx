"use client";
import { useState } from "react";
import { X, Save, Tag, AlertCircle, Loader2 } from "lucide-react";
import { createSubject } from "@/services/admin"; 
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
}

const CATEGORIES = ["ACADEMIC", "SKILLS", "LANGUAGE"] as const;

export default function AddSubjectModal({ isOpen, onClose, initialData, onSuccess }: ModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "ACADEMIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { name, category };
      let res;

      if (initialData?.id) {
        // যদি ID থাকে তবে আপডেট এপিআই কল হবে
        res = await updateSubject(initialData.id, payload);
      } else {
        // নতুন সাবজেক্ট তৈরির জন্য
        res = await createSubject(payload);
      }

      if (res.success) {
        toast.success(initialData ? "Subject updated!" : "Subject created!");
        onSuccess();
        onClose();
      } else {
        setError(res.message || "Operation failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Internal server error");
      console.error("Subject save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-8 py-6 bg-muted/30">
          <h3 className="font-black text-xl tracking-tight text-foreground">
            {initialData ? "Edit Subject" : "New Subject"}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-muted rounded-full transition-all text-muted-foreground hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 text-rose-600 text-sm font-bold border border-rose-200 animate-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Subject Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input 
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold placeholder:font-medium disabled:opacity-50"
              placeholder="e.g. Web Development"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <Tag className="h-3 w-3 text-primary" /> Category
            </label>
            <div className="relative group">
              <select 
                disabled={loading}
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-6 py-4 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer font-bold disabled:opacity-50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="font-bold">
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.97] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" /> 
                {initialData ? "Save Changes" : "Create Subject"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}