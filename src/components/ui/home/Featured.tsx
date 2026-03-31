import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { mockTutors } from "@/lib/mockData";
import TutorCard from "@/components/ui/tutors/TutorCard";

export default function FeaturedTutorsSection() {
  // Taking a subset of tutors for the featured section
  const featuredTutors = mockTutors.slice(0, 3);

  return (
    <section id="tutors" className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
              <GraduationCap className="h-4 w-4" />
              <span>Top Rated Tutors</span>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Meet our <span className="text-primary italic">top-performing</span> educators.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Hand-picked professionals with proven track records in helping students achieve their goals.
            </p>
          </div>
          <Link 
            href="/tutors" 
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-border bg-card px-8 text-lg font-bold text-card-foreground shadow-sm transition hover:border-primary/30 hover:bg-muted active:scale-95"
          >
            Explore All Tutors
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </div>
    </section>
  );
}
