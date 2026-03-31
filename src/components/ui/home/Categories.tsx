"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Languages, Loader2, Globe2 
} from "lucide-react";
import { getLanguages, Language } from "@/services/admin";

export default function LanguageCategoriesSection() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const res = await getLanguages(); 
        if (res?.success) {
          // ডেটা অ্যারে কিনা চেক করে সেট করা
          const data = Array.isArray(res.data) ? res.data : [];
          setLanguages(data);
        }
      } catch (error) {
        console.error("Failed to fetch languages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  return (
    <section id="languages" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary/80 mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-primary/40"></span>
            Global Learning
          </h2>
          <h3 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
            Learn in your <span className="text-primary italic text-glow">preferred</span> language.
          </h3>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Connect with expert tutors who speak your language and can guide you through complex subjects with ease.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Fetching languages...</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {languages.length > 0 ? (
            languages.map((lang) => (
              <Link
                key={lang.id}
                href={`/tutors?language=${lang.id}`} // সরাসরি ল্যাঙ্গুয়েজ আইডি দিয়ে ফিল্টার
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
              >
                {/* Decorative Background Glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Icon Box */}
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-[10deg] shadow-inner">
                  <Globe2 className="h-8 w-8" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex-1">
                  <h4 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {lang.name}
                  </h4>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    Discover specialized tutors offering lessons in <span className="font-semibold text-foreground/80">{lang.name}</span> for various academic levels.
                  </p>
                </div>
                
                {/* Footer Link */}
                <div className="relative z-10 mt-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Find {lang.name} Tutors
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-[2.5rem] border border-dashed border-border p-20 text-center">
              <Languages className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No languages found in the database.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}