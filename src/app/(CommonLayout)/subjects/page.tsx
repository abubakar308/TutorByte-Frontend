"use client"

import Link from "next/link";
import { ArrowRight, BookOpen, Search, Users } from "lucide-react";
import { useEffect } from "react";

type Subject = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  tutorCount?: number;
};

async function getSubjects(): Promise<Subject[]> {
  try {
  
    useEffect(() => { 

        const fetchSubjects = async () => {
            const res = await getSubjects();
            console.log("Fetched subjects:", res);
        };

        fetchSubjects();
    }
    , []);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subjects`, {

    return result?.data || [];
  } catch (error) {
    console.error("Subjects fetch error:", error);
    return [];
  }
}

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Explore Subjects
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Discover subjects and find tutors who match your learning goals.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Browse TutorByte subjects to explore expert tutors, learning categories,
              and topic-specific support for your academic or skill-building journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tutors"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Find Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {subjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="group rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight transition group-hover:text-primary">
                  {subject.name}
                </h2>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-muted-foreground">
                  {subject.description ||
                    `Explore qualified tutors for ${subject.name} and find the right match based on your learning needs.`}
                </p>

                <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {subject.tutorCount ?? 0} tutors
                  </span>
                </div>

                <Link
                  href={`/tutors?subject=${encodeURIComponent(subject.name)}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                >
                  Explore {subject.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h2 className="mt-4 text-xl font-bold">No subjects available right now</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We could not find any active subjects at the moment. Please check again later.
            </p>
            <Link
              href="/tutors"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Browse Tutors
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}