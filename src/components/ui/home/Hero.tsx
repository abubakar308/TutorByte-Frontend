"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  CalendarClock,
  ShieldCheck,
  Star,
  Sparkles,
  ChevronDown,
  BookOpen,
  Globe2,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getLanguages, Language } from "@/services/admin";
import { getSearchSuggestions } from "@/services/ai";

type SuggestionState = {
  subjects: { id: string; name: string }[];
  languages: { id: string; name: string }[];
  tutors: { id: string; bio: string | null; user: { name: string | null } }[];
};

export default function HeroSection() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [suggestions, setSuggestions] = useState<SuggestionState>({
    subjects: [],
    languages: [],
    tutors: [],
  });
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getLanguages(1, 100, "");
        const langArr = Array.isArray(res?.data) ? res.data : [];
        setCategories(langArr);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
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
        const res = await getSearchSuggestions(searchQuery.trim());

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
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (searchQuery.trim()) {
      query.set("search", searchQuery.trim());
    }

    if (selectedLanguage) {
      query.set("language", selectedLanguage);
    }

    setShowSuggestions(false);
    router.push(`/tutors${query.toString() ? `?${query.toString()}` : ""}`);
  };

  const handleSuggestionClick = (value: string) => {
    const query = new URLSearchParams();

    query.set("search", value);
    if (selectedLanguage) {
      query.set("language", selectedLanguage);
    }

    setSearchQuery(value);
    setShowSuggestions(false);
    router.push(`/tutors?${query.toString()}`);
  };

  const totalSuggestions =
    suggestions.subjects.length +
    suggestions.languages.length +
    suggestions.tutors.length;

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border/50 pt-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

      <div className="mx-auto grid min-h-[65vh] max-w-7xl gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:pb-14 lg:pt-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by students worldwide
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Find the right tutor, book confidently, and learn faster with
            TutorByte.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Personalized tutor matching across subjects and languages, verified
            educator profiles, and seamless session booking for a premium 1-on-1
            learning experience.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/tutors"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/become-tutor"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-card px-6 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              Become a Tutor
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center -space-x-2.5">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background object-cover shadow-sm"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="Tutor profile"
                />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground">
                +2k
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                500+ students
              </span>{" "}
              booked sessions this week
            </p>
          </div>

          <div
            ref={containerRef}
            className="mt-9 max-w-2xl rounded-3xl border border-border/70 bg-card/80 p-3 shadow-xl shadow-primary/5 backdrop-blur"
          >
            <div className="grid gap-2 md:grid-cols-[1fr_200px_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-12 w-full rounded-2xl border border-transparent bg-background/60 pl-11 pr-4 text-sm text-foreground outline-none ring-offset-1 transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                  placeholder="Search tutors by subject, skill, or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (totalSuggestions > 0) setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                    {suggestionsLoading ? (
                      <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading suggestions...
                      </div>
                    ) : totalSuggestions > 0 ? (
                      <div className="max-h-80 overflow-y-auto p-2">
                        {suggestions.subjects.length > 0 && (
                          <div className="mb-2">
                            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Subjects
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
                            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Languages
                            </p>
                            {suggestions.languages.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleSuggestionClick(item.name)}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                              >
                                <Globe2 className="h-4 w-4 text-primary" />
                                {item.name}
                              </button>
                            ))}
                          </div>
                        )}

                        {suggestions.tutors.length > 0 && (
                          <div>
                            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Tutors
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

              <div className="hidden md:block">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-transparent bg-background/60 px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Languages</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                Search
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium">Explore by language below</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-primary" />
          </div>
        </div>

        <div className="relative z-10 hidden lg:block">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -left-10 top-12 z-20 rounded-3xl border border-border/60 bg-card/65 p-4 shadow-xl backdrop-blur-xl transition hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    Flexible Scheduling
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Book around your day
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-muted shadow-2xl shadow-primary/10">
              <div className="pointer-events-none absolute -right-16 -top-16 z-10 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="Student learning online with tutor"
                className="h-[500px] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 -right-8 z-20 w-72 rounded-3xl border border-border/60 bg-card/65 p-5 shadow-xl backdrop-blur-xl transition hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    Live Session
                  </p>
                </div>
                <p className="text-sm font-semibold leading-snug text-card-foreground">
                  Personalized Math lesson with A. Rahman started 5 minutes ago
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  AI-supported progress tracking enabled
                </div>
              </div>
            </div>

            <div className="absolute right-8 top-10 z-20 rounded-2xl border border-border/60 bg-card/65 px-3 py-2 text-xs text-muted-foreground shadow-md backdrop-blur-xl transition hover:-translate-y-1">
              <span className="font-semibold text-foreground">4.9/5</span>{" "}
              average tutor rating
              <Star className="ml-2 inline h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}