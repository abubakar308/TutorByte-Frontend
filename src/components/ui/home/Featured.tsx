"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Star } from "lucide-react";
import TutorCard from "@/components/ui/tutors/TutorCard";
import { getAllTutors } from "@/services/tutors";

export default function FeaturedTutorsSection() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tutorsRes] = await Promise.all([
          getAllTutors(),
        ]);

        console.log("Tutors response:", tutorsRes);
        if (tutorsRes.success && Array.isArray(tutorsRes.data)) {
          const featured = tutorsRes.data
            .filter((t: any) => t.isApproved && t.availabilities.length > 1)
            .slice(0, 3);

          setTutors(featured);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section id="tutors" className="relative bg-muted/30 py-24 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span>Elite Selection</span>
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Meet our <span className="text-primary italic">top-rated</span> educators.
            </h2>
          </div>
          
          <Link 
            href="/tutors" 
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary"
          >
            Explore All Tutors
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <p className="text-sm font-bold text-muted-foreground">Finding our best experts...</p>
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="transition-all duration-300 hover:-translate-y-2">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-border p-20 text-center">
            <p className="text-muted-foreground font-medium">No verified tutors found at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}