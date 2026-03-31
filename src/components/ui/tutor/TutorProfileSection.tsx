"use client";
import { useState, useEffect } from "react";
import { Save, User, BookOpen, Globe, Loader2, X, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { getLanguages, getSubjects, Language } from "@/services/admin";
import { createTutorProfile, TutorProfile } from "@/services/tutor";
import { Subject } from "@/types/tutor";

export default function TutorProfileSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

const [profile, setProfile] = useState<{
  bio: string;
  hourlyRate: number;
  experienceYears: number;
  subjects: string[];
  languages: string[];
}>({
  bio: "",
  hourlyRate: 0,
  experienceYears: 0,
  subjects: [],
  languages: [],
});
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);


  useEffect(() => {
    const initMetadata = async () => {
      try {
        setLoading(true);
      
        const [subRes, langRes] = await Promise.all([
          getSubjects(),
          getLanguages()
        ]);


      const arr = subRes?.data;;
setSubjects(Array.isArray(arr) ? arr : []);
        const langArr = langRes?.data;
setLanguages(Array.isArray(langArr) ? langArr : []);
      } catch (err) {
        toast.error("Failed to load subjects or languages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initMetadata();
  }, []);

  const handleSave = async () => {
    if (!profile.bio || profile.subjects?.length === 0) {
      toast.error("Please fill in bio and select at least one subject");
      return;
    }

    setSaving(true);
    try {
      const res = await createTutorProfile(profile as TutorProfile);
      if (res.success) {
        toast.success("Tutor profile created successfully!");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };
const toggleItem = (id: string, field: 'subjects' | 'languages') => {
  const currentList = (profile[field] as string[]) || [];
  const isExist = currentList.includes(id);

  let updatedList: string[];
  if (isExist) {
    updatedList = currentList.filter(item => item !== id);
  } else {
    updatedList = [...currentList, id];
  }

  setProfile({ ...profile, [field]: updatedList });
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="animate-spin text-primary h-10 w-10" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading resources...</p>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left side: Bio and Rates */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Setup
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Professional Bio</label>
              <textarea 
                rows={4}
                placeholder="Write about your expertise and teaching style..."
                value={profile.bio}
                onChange={(e) => setProfile(p => ({...p, bio: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hourly Rate ($)</label>
              <input 
                type="number"
                min="0"
                value={profile.hourlyRate}
                onChange={(e) => setProfile(p => ({...p, hourlyRate: Number(e.target.value)}))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Years of Experience</label>
              <input 
                type="number"
                min="0"
                value={profile.experienceYears}
                onChange={(e) => setProfile(p => ({...p, experienceYears: Number(e.target.value)}))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="mt-8 w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Processing..." : "Create Tutor Profile"}
          </button>
        </div>
      </div>

      {/* Right side: Selection Panels */}
      <div className="space-y-6">
        {/* Subjects Selection */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" /> Subjects
          </h3>
          <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
            {profile.subjects?.map(id => {
              const sub = subjects.find(s => s.id === id);
              return (
                <span key={id} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[11px] font-bold rounded-lg border border-primary/20 animate-in zoom-in-95">
                  {sub?.name || "Subject"}
                  <X className="h-3 w-3 cursor-pointer hover:text-rose-500" onClick={() => toggleItem(id, 'subjects')} />
                </span>
              );
            })}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <select 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/30 text-xs appearance-none outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(e) => toggleItem(e.target.value, 'subjects')}
              value=""
            >
              <option value="" disabled>Add a subject...</option>
              {subjects.filter(s => !profile.subjects?.includes(s.id)).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Languages Selection */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
            <Globe className="h-4 w-4 text-primary" /> Languages
          </h3>
          <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
            {profile.languages?.map(id => {
              const lang = languages.find(l => l.id === id);
              return (
                <span key={id} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-200/50">
                  {lang?.name || "Lang"}
                  <X className="h-3 w-3 cursor-pointer hover:text-rose-500" onClick={() => toggleItem(id, 'languages')} />
                </span>
              );
            })}
          </div>
          <select 
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-xs outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(e) => toggleItem(e.target.value, 'languages')}
              value=""
            >
              <option value="" disabled>Select languages...</option>
              {languages.filter(l => !profile.languages?.includes(l.id)).map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}