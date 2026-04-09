"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Quote, Star } from "lucide-react";
import Link from "next/link";
import { mapReviewsToTestimonials } from "@/lib/testimonial";
import { getAllReviews, TestimonialItem } from "@/services/reviews";


export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const res = await getAllReviews();

        if (res.success) {
          setTestimonials(mapReviewsToTestimonials(res.data));
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const marqueeItems = useMemo(() => {
    if (!testimonials.length) return [];
    return [...testimonials, ...testimonials];
  }, [testimonials]);

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
            <span className="h-px w-8 bg-primary/30"></span>
            Testimonials
            <span className="h-px w-8 bg-primary/30"></span>
          </h2>

          <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What learners say about TutorByte.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Real feedback from students who explored tutors and improved their learning journey.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex min-h-[320px] animate-pulse flex-col rounded-[2rem] border border-border bg-card p-6"
              >
                <div className="h-12 w-12 rounded-2xl bg-muted mb-5" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-4 bg-muted rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative">
            {/* Gradient edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

            {/* Marquee */}
            <div className="overflow-hidden">
              <div className="testimonial-marquee flex w-max gap-6 py-2 hover:[animation-play-state:paused]">
                {marqueeItems.map((item, index) => (
                  <TestimonialCard key={`${item.id}-${index}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
            <p className="font-semibold text-foreground">
              No testimonials available right now.
            </p>
          </div>
        )}

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary/30 hover:text-primary"
          >
            View All Testimonials
          </Link>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .testimonial-marquee {
          animation: scroll 28s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <article className="flex min-h-[320px] w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-lg">
      {/* Top */}
      <div className="mb-4 flex items-center justify-between">
        <Quote className="h-5 w-5 text-primary" />

        <div className="flex gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < item.rating ? "fill-current" : "opacity-30"}`}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="flex-1 text-sm leading-7 text-muted-foreground">
        “{item.comment}”
      </p>

      {/* Tutor */}
      <div className="mt-4 text-sm">
        <span className="text-xs uppercase text-primary">Learned with</span>
        <p className="font-semibold">{item.tutorName}</p>
      </div>

      {/* Student */}
      <div className="mt-4 flex items-center gap-3 border-t pt-4">
        {item.studentImage ? (
          <img
            src={item.studentImage}
            alt={item.studentName}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
            {getInitials(item.studentName)}
          </div>
        )}

        <div>
          <p className="text-sm font-bold">{item.studentName}</p>
        </div>
      </div>
    </article>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}