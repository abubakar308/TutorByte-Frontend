"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  X,
  Globe,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  Loader2,
} from "lucide-react";
import TutorCard from "@/components/ui/tutors/TutorCard";
import { getAllTutors, Tutor } from "@/services/tutors";
import { getSubjects, getLanguages } from "@/services/admin";
import { getSearchSuggestions } from "@/services/ai";
import { Language, Subject } from "@/types/tutor";
import { TutorCardSkeleton } from "@/components/ui/tutors/SkeletonCard";

type SuggestionState = {
  subjects: { id: string; name: string }[];
  languages: { id: string; name: string }[];
  tutors: { id: string; bio: string | null; user: { name: string | null } }[];
};

export default function TutorsListingPage() {
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const initialSearch = searchParams.get("search") || "";
  const initialLanguage = searchParams.get("language") || "";

  const [allTutors, setAllTutors] = useState<Tutor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string | null>(null);
  const [selectedLanguageName, setSelectedLanguageName] = useState<string | null>(
    initialLanguage || null
  );
  const [maxPrice, setMaxPrice] = useState<number>(100);

  const [page, setPage] = useState(1);
  const limit = 12;

  const [suggestions, setSuggestions] = useState<SuggestionState>({
    subjects: [],
    languages: [],
    tutors: [],
  });
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSearchInput(initialSearch);
    setSelectedLanguageName(initialLanguage || null);
  }, [initialSearch, initialLanguage]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [subjectsRes, languagesRes, tutorsRes] = await Promise.all([
          getSubjects(),
          getLanguages(1, 100, ""),
          getAllTutors({ page: 1, limit: 200 }),
        ]);

        const subjectArr = Array.isArray(subjectsRes?.data) ? subjectsRes.data : [];
        const languageArr = Array.isArray(languagesRes?.data)
          ? languagesRes.data
          : [];
        const tutorsArr = Array.isArray(tutorsRes?.data?.tutors)
          ? tutorsRes.data.tutors
          : [];

        setSubjects(subjectArr);
        setLanguages(languageArr);
        setAllTutors(tutorsArr);
      } catch (error) {
        console.error("Failed to load tutors data:", error);
        setSubjects([]);
        setLanguages([]);
        setAllTutors([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchInput, selectedSubjectName, selectedLanguageName, maxPrice]);

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions({
        subjects: [],
        languages: [],
        tutors: [],
      });
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSuggestionsLoading(true);

        const res = await getSearchSuggestions(searchInput.trim());

        if (res.success && res.data) {
          setSuggestions({
            subjects: res.data.subjects || [],
            languages: res.data.languages || [],
            tutors: res.data.tutors || [],
          });
          setShowSuggestions(true);
        } else {
          setSuggestions({
            subjects: [],
            languages: [],
            tutors: [],
          });
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error);
        setSuggestions({
          subjects: [],
          languages: [],
          tutors: [],
        });
        setShowSuggestions(false);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredTutors = useMemo(() => {
    return allTutors.filter((tutor) => {
      const tutorName = tutor?.user?.name?.toLowerCase() || "";
      const tutorBio = tutor?.bio?.toLowerCase() || "";

      const tutorSubjects =
        tutor?.subjects?.map((s) => s?.subject?.name?.toLowerCase()).filter(Boolean) ||
        [];

      const tutorLanguages =
        tutor?.languages
          ?.map((l) => l?.language?.name?.toLowerCase())
          .filter(Boolean) || [];

      const normalizedSearch = appliedSearch.trim().toLowerCase();
      const normalizedSelectedSubject = selectedSubjectName?.toLowerCase() || "";
      const normalizedSelectedLanguage = selectedLanguageName?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        tutorName.includes(normalizedSearch) ||
        tutorBio.includes(normalizedSearch) ||
        tutorSubjects.some((subject) => subject.includes(normalizedSearch)) ||
        tutorLanguages.some((language) => language.includes(normalizedSearch));

      const matchesSubject =
        !normalizedSelectedSubject ||
        tutorSubjects.some((subject) => subject === normalizedSelectedSubject);

      const matchesLanguage =
        !normalizedSelectedLanguage ||
        tutorLanguages.some((language) => language === normalizedSelectedLanguage);

      const matchesPrice = Number(tutor?.hourlyRate || 0) <= maxPrice;

      return matchesSearch && matchesSubject && matchesLanguage && matchesPrice;
    });
  }, [allTutors, appliedSearch, selectedSubjectName, selectedLanguageName, maxPrice]);

  const total = filteredTutors.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const paginatedTutors = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredTutors.slice(start, end);
  }, [filteredTutors, page]);

  const hasActiveFilters =
    appliedSearch.trim() ||
    selectedSubjectName !== null ||
    selectedLanguageName !== null ||
    maxPrice !== 100;

  const handleReset = () => {
    setSearchInput("");
    setSelectedSubjectName(null);
    setSelectedLanguageName(null);
    setMaxPrice(100);
    setPage(1);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (value: string) => {
    setSearchInput(value);
    setAppliedSearch(value);
    setShowSuggestions(false);
    setPage(1);
  };

  const totalSuggestions =
    suggestions.subjects.length +
    suggestions.languages.length +
    suggestions.tutors.length;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <TutorCardSkeleton key={idx} />
          ))}
        </div>
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

            <div ref={searchContainerRef} className="relative z-30 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, bio, subject, or language..."
                className="h-14 w-full rounded-2xl border border-border bg-card px-12 text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => {
                  if (totalSuggestions > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAppliedSearch(searchInput);
                    setShowSuggestions(false);
                    setPage(1);
                  }
                }}
              />

              {showSuggestions && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-100 max-h-80 overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
                  {suggestionsLoading ? (
                    <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading suggestions...
                    </div>
                  ) : totalSuggestions > 0 ? (
                    <div className="max-h-80 z-100 overflow-y-auto p-2">
                      {suggestions.subjects.length > 0 && (
                        <div className="mb-2">
                          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          </p>
                          {suggestions.subjects.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSuggestionClick(item.name)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                            >
                              <BookOpen className="h-4 w-4 text-primary" />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {suggestions.languages.length > 0 && (
                        <div className="mb-2">
                          <p className="px-3 py-2 text-[11px] z-50 font-bold uppercase tracking-wider text-muted-foreground">
                          </p>
                          {suggestions.languages.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSuggestionClick(item.name)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                            >
                              <Globe className="h-4 w-4 text-primary" />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {suggestions.tutors.length > 0 && (
                        <div>
                          <p className="px-3 py-2 text-[11px] z-50 font-bold uppercase tracking-wider text-muted-foreground">
                          </p>
                          {suggestions.tutors.map((item) => (
                            <button
                              key={item.id}
                              onClick={() =>
                                handleSuggestionClick(item.user?.name || "")
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                            >
                              <User className="h-4 w-4 text-primary" />
                              {item.user?.name || "Tutor"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">
                      No suggestions found.
                    </div>
                  )}
                </div>
              )}
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
                    onClick={() => setSelectedSubjectName(null)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${selectedSubjectName === null
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                  >
                    All
                  </button>

                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubjectName(s.name)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${selectedSubjectName === s.name
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
                    onClick={() => setSelectedLanguageName(null)}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${selectedLanguageName === null
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
                      onClick={() => setSelectedLanguageName(lang.name)}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${selectedLanguageName === lang.name
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
                    {searchInput.trim() && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Search: {searchInput}
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
                  {paginatedTutors.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">{total}</span> results
              </p>

              <p className="text-sm text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </p>
            </div>

            {paginatedTutors.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedTutors.map((tutor) => (
                    <div key={tutor.id} className="h-full">
                      <TutorCard tutor={tutor} />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
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
                    disabled={page >= totalPages}
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