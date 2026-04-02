"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Trash2, Loader2, Languages as LangIcon } from "lucide-react";
import { deleteLanguage, getLanguages } from "@/services/admin"; 
import { toast } from "sonner";
import AddLanguageModal from "@/components/modals/admin/AddLanguage";


export default function LanguagesSection() {
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const res = await getLanguages();
      if (res.success && res.data) {
        const arr = res.data? res.data : [];
setLanguages(Array.isArray(arr) ? arr : []);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language?")) return;
    try {
      const res = await deleteLanguage(id);
      if (res.success) {
        toast.success("Language deleted!");
        fetchLanguages();
      }
    } catch (error) {
      toast.error("Failed to delete language");
    }
  };

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Languages</h2>
          <p className="text-sm text-muted-foreground">Manage platform supported languages</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center rounded-2xl border border-border bg-card px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60 w-40 md:w-60"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <LangIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredLanguages.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredLanguages.map((lang) => (
            <div
              key={lang.id}
              className="group relative flex flex-col gap-3 rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-secondary/50 text-secondary-foreground">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(lang.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black tracking-tight">{lang.name}</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  ID: {lang.id.slice(-6)}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border py-20">
          <Globe className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="font-bold text-muted-foreground">No languages found</p>
        </div>
      )}

      {/* Add Language Modal */}
      <AddLanguageModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLanguages} 
      />
    </div>
  );
}