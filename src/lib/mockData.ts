"use client";

import { useState, useEffect } from "react";
import Link from "next/navigation";
import { GraduationCap, ArrowRight, Loader2, Star } from "lucide-react";
import TutorCard from "@/components/ui/tutors/TutorCard";
import { getAllTutors } from "@/services/tutor"; // আপনার টিউটর সার্ভিস ফাংশন

export default function FeaturedTutorsSection() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTutors = async () => {
      try {
        const res = await getAllTutors(); // API থেকে সব টিউটর নিয়ে আসা
        if (res?.success) {
          // ফিল্টারিং লজিক: রেটিং ৪.৫ এর উপরে এবং ভেরিফাইড টিউটরদের আগে দেখানো হচ্ছে
          const sorted = res.data
            .filter((t: any) => t.isVerified === true) // শুধুমাত্র ভেরিফাইড টিউটর
            .sort((a: any, b: any) => b.rating - a.rating) // হাই রেটিং অনুযায়ী সর্টিং
            .slice(0, 3); // সেরা ৩ জন

          setTutors(sorted);
        }
      } catch (error) {
        console.error("Error fetching featured tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTutors();
  }, []);

  return (
    <section id="tutors" className="relative bg-muted/30 py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span>Elite Selection</span>
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Meet our <span className="text-primary italic">top-rated</span> educators.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We've hand-picked these professionals based on student feedback, 
              subject expertise, and verified background checks.
            </p>
          </div>
          
          <Link 
            href="/tutors" 
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:opacity-80 transition-all"
          >
            Explore All Tutors
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">
              Finding our best experts...
            </p>
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="transition-transform hover:-translate-y-2 duration-300">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-border p-20 text-center">
            <p className="text-muted-foreground font-medium">No featured tutors found at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}