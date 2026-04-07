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
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
            <span className="h-px w-8 bg-primary/40"></span>
            Preferred Languages
          </h2>
          <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Learn in your <span className="text-primary">preferred language</span>.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Connect with tutors who teach in the language you are most comfortable with.
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
                href={`/tutors?language=${lang.id}`}
                className="group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Globe2 className="h-6 w-6" />
                </div>
                
                <div className="relative z-10 flex-1">
                  <h4 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {lang.name}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Discover tutors offering personalized lessons in {lang.name} across academic and practical subjects.
                  </p>
                </div>
                
                <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Find {lang.name} Tutors
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-16 text-center">
              <Languages className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">No languages found right now.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}