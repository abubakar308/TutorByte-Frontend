"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  CalendarClock,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getLanguages, Language } from "@/services/admin";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getLanguages();
      const langArr = res?.data;
      setCategories(Array.isArray(langArr) ? langArr : []);
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (searchQuery.trim()) {
      query.set("search", searchQuery.trim());
    }
    if (selectedLanguage) {
      query.set("language", selectedLanguage);
    }
    router.push(`/tutors${query.toString() ? `?${query.toString()}` : ""}`);
  };

  return (
    <section id="home" className="relative overflow-hidden pt-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

      <div className="mx-auto grid min-h-[62vh] max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by students worldwide
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Find the right tutor, book confidently, and learn faster with TutorByte.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Personalized tutor matching across subjects and languages, verified educator
            profiles, and seamless session booking for a premium 1-on-1 learning experience.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/tutors"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/become-tutor"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-card px-6 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
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
              <span className="font-semibold text-foreground">500+ students</span> booked sessions this week
            </p>
          </div>

          <div className="mt-9 max-w-2xl rounded-3xl border border-border/70 bg-card/80 p-3 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="grid gap-2 md:grid-cols-[1fr_200px_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-12 w-full rounded-2xl border border-transparent bg-background/60 pl-11 pr-4 text-sm text-foreground outline-none ring-offset-1 transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                  placeholder="Search tutors by subject, skill, or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="hidden md:block">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-transparent bg-background/60 px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Languages</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
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
        </div>

        <div className="relative z-10 hidden lg:block">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -left-10 top-12 z-20 rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur transition hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Flexible Scheduling</p>
                  <p className="text-[11px] text-muted-foreground">Book around your day</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-muted shadow-2xl shadow-primary/10">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="Student learning online with tutor"
                className="h-[560px] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 -right-8 z-20 w-72 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-xl backdrop-blur transition hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Live Session</p>
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

            <div className="absolute right-8 top-10 z-20 rounded-2xl border border-border/70 bg-card/85 px-3 py-2 text-xs text-muted-foreground shadow-md backdrop-blur transition hover:-translate-y-1">
              <span className="font-semibold text-foreground">4.9/5</span> average tutor rating
              <Star className="ml-2 inline h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}