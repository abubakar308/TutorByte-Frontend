"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { getSubjects } from "@/services/admin";
import { useEffect, useMemo, useState } from "react";

type Subject = {
  id: string;
  name: string;
  category: "ACADEMIC" | "SKILLS" | "LANGUAGE";
};

const categoryOptions = [
  { label: "All", value: "ALL" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Skills", value: "SKILLS" },
  { label: "Language", value: "LANGUAGE" },
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
        const res = await getSubjects(1, 50);
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
    <main className="bg-background text-foreground">
      <section className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-black">Explore Subjects</h1>
          <p className="mt-4 text-muted-foreground">
            Find tutors by subject and start learning today.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className="h-12 w-full rounded-xl border bg-background pl-11 pr-4 outline-none transition focus:border-primary"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as CategoryValue)
              }
              className="h-12 rounded-xl border bg-background px-4 outline-none transition focus:border-primary"
            >
              {categoryOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {searchQuery.trim() && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Search: {searchQuery}
                </span>
              )}

              {selectedCategory !== "ALL" && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Category: {selectedCategory}
                </span>
              )}

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition hover:border-primary hover:text-primary"
              >
                <X size={14} />
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 animate-pulse rounded-2xl border bg-card"
              />
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Available Subjects
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredSubjects.length} subject
                {filteredSubjects.length > 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {subject.category}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold">{subject.name}</h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Learn {subject.name} with expert tutors and improve your
                    skills through guided learning.
                  </p>

                  <Link
                    href={`/tutors?subject=${subject.id}`}
                    className="mt-4 inline-flex items-center gap-1 font-semibold text-primary"
                  >
                    Explore
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">No subjects found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search text or category filter.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}