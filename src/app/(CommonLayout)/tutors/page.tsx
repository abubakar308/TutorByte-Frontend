"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  X,
  Globe,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TutorCard from "@/components/ui/tutors/TutorCard";
import { getAllTutors, Tutor } from "@/services/tutors";
import { getSubjects, getLanguages } from "@/services/admin";
import { Language, Subject } from "@/types/tutor";
import { TutorCardSkeleton } from "@/components/ui/tutors/SkeletonCard";

export default function TutorsListingPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(100);

  const [page, setPage] = useState(1);
  const limit = 12;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [subjectsRes, languagesRes] = await Promise.all([
          getSubjects(),
          getLanguages(1, 100, ""),
        ]);

        const subjectArr = Array.isArray(subjectsRes?.data)
          ? subjectsRes.data
          : [];
        const languageArr = Array.isArray(languagesRes?.data)
          ? languagesRes.data
          : [];

        setSubjects(subjectArr);
        setLanguages(languageArr);
      } catch (error) {
        console.error("Failed to load subjects/languages:", error);
        setSubjects([]);
        setLanguages([]);
      }
    };

    loadStaticData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedSubjectId, selectedLanguageId]);

  const loadTutors = useCallback(async () => {
    try {
      setFetching(true);

      const queryParams: Record<string, string | number> = {
        page,
        limit,
      };

      if (searchQuery.trim()) queryParams.search = searchQuery.trim();
      if (selectedSubjectId) queryParams.subjectId = selectedSubjectId;
      if (selectedLanguageId) queryParams.languageId = selectedLanguageId;

      const tutorsRes = await getAllTutors(queryParams);

      if (tutorsRes.success) {
        setTutors(tutorsRes.data?.tutors || []);
        setTotal(tutorsRes.data?.meta?.total || 0);
      } else {
        setTutors([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error loading tutors:", error);
      setTutors([]);
      setTotal(0);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  }, [page, searchQuery, selectedSubjectId, selectedLanguageId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTutors();
    }, 350);

    return () => clearTimeout(timer);
  }, [loadTutors]);

  const finalVisibleTutors = tutors.filter(
    (t) => Number(t.hourlyRate || 0) <= maxPrice
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const selectedSubjectName = subjects.find((s) => s.id === selectedSubjectId)?.name ?? null;
  const selectedLanguageName = languages.find((l) => l.id === selectedLanguageId)?.name ?? null;

  const hasActiveFilters =
    searchQuery.trim() ||
    selectedSubjectId !== null ||
    selectedLanguageId !== null ||
    maxPrice !== 100;

  const handleReset = () => {
    setSearchQuery("");
    setSelectedSubjectId(null);
    setSelectedLanguageId(null);
    setMaxPrice(100);
    setPage(1);
  };

  if (loading) {
    return (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
  {Array.from({ length: 12 }).map((_, idx) => (
    <TutorCardSkeleton key={idx} />
  ))}
</div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative border-b border-border/50 bg-card/10 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <GraduationCap className="h-4 w-4" />
                <span>Find Your Match</span>
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Expert Tutors for Your Mastery
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Connect with world-class educators. Search, filter, compare, and
                book the right tutor for your learning journey.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search
                className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  fetching ? "animate-spin text-primary" : "text-muted-foreground"
                }`}
              />
              <input
                type="text"
                placeholder="Search by name, bio, or keyword..."
                className="h-14 w-full rounded-2xl border border-border bg-card px-12 text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="sticky top-28 space-y-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h3>

                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Subject
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubjectId(null)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      selectedSubjectId === null
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    All
                  </button>

                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubjectId(s.id)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                        selectedSubjectId === s.id
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "border border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-border/50 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Max Price
                  </label>
                  <span className="text-sm font-black text-primary">
                    ${maxPrice}
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              <div className="space-y-4 border-t border-border/50 pt-4">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Language
                </label>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setSelectedLanguageId(null)}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      selectedLanguageId === null
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-bold">All Languages</span>
                  </button>

                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguageId(lang.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                        selectedLanguageId === lang.id
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-bold">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Active Filters
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {searchQuery.trim() && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Search: {searchQuery}
                      </span>
                    )}
                    {selectedSubjectName && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Subject: {selectedSubjectName}
                      </span>
                    )}
                    {selectedLanguageName && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Language: {selectedLanguageName}
                      </span>
                    )}
                    {maxPrice !== 100 && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Max Price: ${maxPrice}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {finalVisibleTutors.length}
                </span>{" "}
                results
              </p>

              <p className="text-sm text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </p>
            </div>

            {fetching && tutors.length === 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[360px] animate-pulse rounded-[2rem] border border-border bg-card"
                  />
                ))}
              </div>
            ) : finalVisibleTutors.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {finalVisibleTutors.map((tutor) => (
                    <div key={tutor.id} className="h-full">
                      <TutorCard tutor={tutor} />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1 || fetching}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">
                    {page} / {totalPages}
                  </div>

                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= totalPages || fetching}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-card/30 px-6 text-center">
                <X className="h-12 w-12 text-muted-foreground" />
                <h4 className="mt-4 text-xl font-bold">No tutors found</h4>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}