"use client";
import { useState } from "react";
import { X, Save, Tag, AlertCircle } from "lucide-react";
import { createSubject } from "@/services/admin";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
}

const CATEGORIES = ["ACADEMIC", "SKILLS", "LANGUAGE"] as const;

export default function AddSubjectModal({ onClose, initialData, onSuccess }: ModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "ACADEMIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      const res = await createSubject({
        name,
        category
      });

      console.log(res)

      if (res.success) {
        toast.success("Subject created!");
        onSuccess();
        onClose();   
      } else {
        setError(res.message || "Something went wrong");
      }
    } catch (error: any) {
      setError(error.message || "Failed to connect to server");
      console.error("Failed to save subject:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-8 py-5 bg-muted/30">
          <h3 className="font-bold text-lg">
            {initialData ? "Edit Subject" : "Add New Subject"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Subject Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input 
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-50"
              placeholder="e.g. Computer Science"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Category
            </label>
            <div className="relative">
              <select 
                disabled={loading}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer disabled:opacity-50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {/* Custom Arrow for select */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">Saving...</span>
            ) : (
              <>
                <Save className="h-5 w-5" /> 
                {initialData ? "Update Subject" : "Create Subject"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}