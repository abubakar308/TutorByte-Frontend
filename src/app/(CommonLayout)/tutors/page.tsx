"use client"

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown, GraduationCap, X, MapPin, Globe, DollarSign } from "lucide-react";
import { mockTutors, mockSubjects, mockLanguages } from "@/lib/mockData";
import TutorCard from "@/components/tutors/TutorCard";

export default function TutorsListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(50);

  const filteredTutors = useMemo(() => {
    return mockTutors.filter(tutor => {
      const matchesSearch = tutor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = selectedSubject === "All" || 
                              tutor.subjects.some(ts => ts.subject.name === selectedSubject);
      
      const matchesLanguage = selectedLanguage === "All" || 
                               tutor.languages.some(tl => tl.language.name === selectedLanguage);
      
      const matchesPrice = Number(tutor.hourlyRate) <= maxPrice;

      return matchesSearch && matchesSubject && matchesLanguage && matchesPrice;
    });
  }, [searchQuery, selectedSubject, selectedLanguage, maxPrice]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search & Header Section */}
      <section className="relative border-b border-border/50 bg-card/10 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <GraduationCap className="h-4 w-4" />
                <span>Find Your Match</span>
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Expert Tutors for Your Mastery
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Connect with world-class educators and start your learning journey today. Filter by subject, expertise, or price.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, bio, or keyword..."
                className="h-16 w-full rounded-[2rem] border border-border bg-card px-12 text-foreground shadow-sm transition outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h3>
                <button 
                  onClick={() => {
                    setSelectedSubject("All");
                    setSelectedLanguage("All");
                    setMaxPrice(50);
                    setSearchQuery("");
                  }}
                  className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                >
                  Reset All
                </button>
              </div>

              {/* Subject Filter */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Subject
                </label>
                <div className="flex flex-wrap gap-2">
                  {["All", ...mockSubjects.map(s => s.name)].map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        selectedSubject === subject
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Max hourly rate
                  </label>
                  <span className="text-sm font-bold text-foreground">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  className="h-2 w-full appearance-none rounded-full bg-muted cursor-pointer accent-primary"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>$10</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Language Filter */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Native Language
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {["All", ...mockLanguages.map(l => l.name)].map((lang) => (
                    <label 
                      key={lang}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                        selectedLanguage === lang 
                          ? "border-primary/30 bg-primary/[0.03] text-primary" 
                          : "border-border bg-card text-muted-foreground hover:border-primary/20"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="language" 
                        className="hidden" 
                        onChange={() => setSelectedLanguage(lang)}
                        checked={selectedLanguage === lang}
                      />
                      <Globe className={`h-4 w-4 ${selectedLanguage === lang ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-semibold">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Tutor Grid */}
          <main className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filteredTutors.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm">
                  Top Rated
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filteredTutors.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-1 xl:grid-cols-2">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-card/30 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-muted text-muted-foreground">
                  <X className="h-8 w-8" />
                </div>
                <h4 className="mt-6 text-xl font-bold text-foreground">No tutors found</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search query to find more results.
                </p>
                <button 
                  onClick={() => {
                    setSelectedSubject("All");
                    setSelectedLanguage("All");
                    setMaxPrice(50);
                    setSearchQuery("");
                  }}
                  className="mt-6 rounded-2xl bg-foreground px-6 py-3 text-sm font-bold text-background transition hover:bg-foreground/90"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}