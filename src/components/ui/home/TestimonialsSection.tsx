"use client";

import { useEffect, useState } from "react";
import { Loader2, Quote, Star } from "lucide-react";
import Link from "next/link";
import { getTestimonials, type TestimonialItem } from "@/services/site";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await getTestimonials();
        if (res.success) {
          setTestimonials(Array.isArray(res.data) ? res.data : []);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
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
            Real feedback from students who explored tutors, booked sessions, and improved their learning journey.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex min-h-[280px] animate-pulse flex-col rounded-[2rem] border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-5 h-10 w-10 rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                  <div className="h-4 w-4/6 rounded bg-muted" />
                </div>
                <div className="mt-auto pt-6">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="mt-2 h-3 w-24 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="group flex min-h-[300px] flex-col rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Quote className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating ? "fill-current" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="flex-1 text-sm leading-7 text-muted-foreground">
                  “{item.quote}”
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <img
                    src={
                      item.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.name
                      )}&background=random`
                    }
                    alt={item.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.role || "Student"}
                      {item.subject ? ` • ${item.subject}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
            <p className="font-semibold text-foreground">
              No testimonials available right now.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
          >
            View All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}