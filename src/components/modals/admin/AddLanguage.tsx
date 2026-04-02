"use client";
import { useState } from "react";
import { X, Save, Globe, AlertCircle, Loader2 } from "lucide-react";
import { createLanguage } from "@/services/admin";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLanguageModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Language name is required");

    setLoading(true);
    setError(null);

    try {
      const res = await createLanguage({ name });

      if (res.success) {
        toast.success("Language added successfully!");
        setName(""); // Reset input
        onSuccess();
        onClose();
      } else {
        setError(res.message || "Failed to add language");
      }
    } catch (err: any) {
      setError(err.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-border px-6 py-5 bg-muted/30">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Add Language
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Language Name
            </label>
            <input 
              required
              autoFocus
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
              placeholder="e.g. Spanish, French, Bengali"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-4 w-4" /> Save Language</>}
          </button>
        </form>
      </div>
    </div>
  );
}