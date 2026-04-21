"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Search, X, Sparkles, GraduationCap, Languages, Cpu } from "lucide-react";
import { getSubjects } from "@/services/admin";
import { useEffect, useMemo, useState } from "react";

type Subject = {
  id: string;
  name: string;
  category: "ACADEMIC" | "SKILLS" | "LANGUAGE";
};

const categoryOptions = [
  { label: "All Subjects", value: "ALL", icon: Sparkles },
  { label: "Academic", value: "ACADEMIC", icon: GraduationCap },
  { label: "Skills & Tech", value: "SKILLS", icon: Cpu },
  { label: "Languages", value: "LANGUAGE", icon: Languages },
] as const;

type CategoryValue = (typeof categoryOptions)[number]["value"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryValue>("ALL");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await getSubjects(1, 100);
        const arr = res?.data || [];
        setSubjects(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch = subject.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      const matchesCategory =
        selectedCategory === "ALL" || subject.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [subjects, searchQuery, selectedCategory]);

  const hasFilters =
    searchQuery.trim().length > 0 || selectedCategory !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-muted/20 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary-muted)_0%,transparent_100%)] opacity-20" />
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="h-3.5 w-3.5" />
            Empower Your Future
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-6xl animate-in fade-in slide-in-from-bottom-3 duration-700">
            Learn Anything, <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Anywhere.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Browse our curated list of academic subjects, technical skills, and languages. 
            Connect with the perfect tutor to start your journey today.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-[68px] z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects (e.g. Physics, Python, English)..."
                className="h-12 w-full rounded-2xl border border-border/60 bg-muted/30 pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryOptions.map((item) => {
                const Icon = item.icon;
                const active = selectedCategory === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setSelectedCategory(item.value)}
                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Active Filters:</p>
              {searchQuery.trim() && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase text-primary border border-primary/20">
                  "{searchQuery}"
                </span>
              )}
              {selectedCategory !== "ALL" && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase text-primary border border-primary/20">
                  {selectedCategory}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1 text-[10px] font-black uppercase text-rose-500 transition hover:bg-rose-500 hover:text-white"
              >
                <X size={12} />
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 animate-pulse rounded-3xl border border-border/50 bg-muted/30"
              />
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Available Subjects</h2>
                <p className="mt-1 text-sm text-muted-foreground">Tailored to your learning needs</p>
              </div>
              <div className="rounded-2xl bg-muted px-4 py-2 text-xs font-bold text-muted-foreground border border-border/50">
                {filteredSubjects.length} Results
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {subject.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-foreground">{subject.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        Master {subject.name} with our top-rated tutors. Comprehensive learning paths available.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                      href={`/tutors?subject=${subject.id}`}
                      className="inline-flex items-center gap-2 text-sm font-black text-primary"
                    >
                      Find Tutors
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                  
                  {/* Decorative background icon */}
                  <BookOpen className="absolute -right-4 -bottom-4 h-24 w-24 text-primary/5 transition-transform group-hover:scale-110" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="mt-6 text-2xl font-black">No matches found</h3>
            <p className="mt-2 text-muted-foreground">We couldn't find any subjects matching your current filters.</p>
            <button
              onClick={clearFilters}
              className="mt-8 rounded-2xl bg-primary px-8 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-foreground px-8 py-16 text-center text-background dark:bg-card dark:text-foreground border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <h2 className="relative text-3xl font-black sm:text-4xl">Can't find a subject?</h2>
          <p className="relative mt-4 text-background/70 dark:text-muted-foreground">
            Suggest a new subject or contact our support team for personalized assistance.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/contact" 
              className="rounded-2xl bg-primary px-8 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 active:scale-95"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}