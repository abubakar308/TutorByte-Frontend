"use client"

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, GraduationCap, X, Globe, Loader2 } from "lucide-react";
import TutorCard from "@/components/ui/tutors/TutorCard";
import { getAllTutors, Tutor } from "@/services/tutors"; 
import { getSubjects, getLanguages } from "@/services/admin"; 

export default function TutorsListingPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(100);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tutorsRes, subjectsRes, languagesRes] = await Promise.all([
          getAllTutors(),
          getSubjects(),
          getLanguages()
        ]);

        if (tutorsRes.success) setTutors(tutorsRes.data);
        if (subjectsRes?.success) setSubjects(subjectsRes.data);
        if (languagesRes?.success) setLanguages(languagesRes.data);
        
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ ফিল্টার লজিক আপডেট করা হয়েছে
  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      // নাম এবং বায়োতে সার্চ
      const matchesSearch =
        tutor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());

      // সাবজেক্ট ফিল্টার (Nested Array Check)
      const matchesSubject =
        selectedSubject === "All" ||
        tutor.subjects?.some((s) => s.subject.name === selectedSubject);

      // ল্যাঙ্গুয়েজ ফিল্টার (Nested Array Check)
      const matchesLanguage =
        selectedLanguage === "All" ||
        tutor.languages?.some((l) => l.language.name === selectedLanguage);

      // প্রাইস ফিল্টার
      const matchesPrice = Number(tutor.hourlyRate) <= maxPrice;

      return matchesSearch && matchesSubject && matchesLanguage && matchesPrice;
    });
  }, [searchQuery, selectedSubject, selectedLanguage, maxPrice, tutors]);

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-lg font-medium">Loading amazing tutors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
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
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Connect with world-class educators. Filter by subject, expertise, or price.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, bio, or keyword..."
                className="h-16 w-full rounded-3xl border border-border bg-card px-12 text-foreground shadow-sm transition outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                    setMaxPrice(100);
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Subject Filter */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Subject</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubject("All")}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      selectedSubject === "All" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    All
                  </button>
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubject(s.name)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                        selectedSubject === s.name ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Max Price</label>
                  <span className="text-sm font-black text-primary">${maxPrice}</span>
                </div>
                <input
                  type="range" min="5" max="200" step="5"
                  className="h-2 w-full appearance-none rounded-full bg-muted cursor-pointer accent-primary"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              {/* Language Filter */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Language</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setSelectedLanguage("All")}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      selectedLanguage === "All" ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-bold">All Languages</span>
                  </button>
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                        selectedLanguage === lang.name ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-bold">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
             <div className="mb-8 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{filteredTutors.length}</span> results
                </p>
             </div>

            {filteredTutors.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-card/30 text-center">
                <X className="h-12 w-12 text-muted-foreground" />
                <h4 className="mt-4 text-xl font-bold">No tutors found</h4>
                <p className="text-muted-foreground">Try adjusting your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}