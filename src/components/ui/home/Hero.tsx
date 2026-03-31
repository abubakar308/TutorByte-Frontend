"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarClock, Search, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/tutors");
    }
  };

  const stats = [
    { label: "Verified Tutors", value: "1,200+" },
    { label: "Sessions Booked", value: "18K+" },
    { label: "Student Satisfaction", value: "98%" },
    { label: "Countries Reached", value: "35+" },
  ];

  return (
    <section id="home" className="relative overflow-hidden pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.18),transparent_30%),radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="relative z-10">
          <div className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
            Trusted by students worldwide
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-7xl lg:leading-[1.1]">
            Find the right tutor, book in <span className="text-primary italic">minutes</span>.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            TutorByte connects students with verified tutors across subjects,
            languages, and skills through a seamless booking experience.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/tutors" className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]">
              Find a Tutor
            </Link>
            <Link href="/register?role=tutor" className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-8 py-4 text-lg font-bold text-card-foreground transition hover:border-primary/30 hover:bg-muted active:scale-[0.98]">
              Become a Tutor
            </Link>
          </div>

          <div className="mt-12 rounded-[2.5rem] border border-border bg-card/80 p-5 shadow-2xl shadow-primary/5 backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                  placeholder="Search tutors, subjects, or skills"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary/50">
                  <option>All Categories</option>
                  <option>Languages</option>
                  <option>Mathematics</option>
                  <option>Web Development</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4 rotate-90" />
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="h-14 rounded-2xl bg-secondary px-8 font-black text-secondary-foreground transition hover:bg-secondary/90 hover:shadow-lg active:scale-95"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card/50 p-4 shadow-sm"
              >
                <p className="text-2xl font-black tracking-tight text-card-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 hidden lg:block">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -left-12 top-20 z-20 rounded-3xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-card-foreground">
                    Verified Tutors
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Safe profiling & background checks
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[4rem] border-8 border-background bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                alt="Students learning together"
                className="h-[600px] w-full object-cover grayscale-[0.2] transition duration-700 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            <div className="absolute -bottom-10 right-0 z-20 w-80 rounded-[2.5rem] border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-card-foreground">Easy Booking Flow</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                    Pick a tutor, choose a slot, and confirm in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
