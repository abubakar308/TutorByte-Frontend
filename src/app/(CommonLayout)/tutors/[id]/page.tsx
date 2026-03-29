"use client"

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  Languages, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Heart,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { mockTutors } from "@/lib/mockData";
import AvailabilityGrid from "@/components/tutors/AvailabilityGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TutorDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const tutor = mockTutors.find((t) => t.id === id);

  if (!tutor) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-foreground">Tutor not found</h2>
        <p className="mt-2 text-muted-foreground">The tutor you're looking for doesn't exist.</p>
        <Link href="/tutors" className="mt-6 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground transition hover:bg-primary/90">
          Back to Tutors
        </Link>
      </div>
    );
  }

  const { user, subjects, languages, hourlyRate, averageRating, totalReviews, bio, experienceYears, availabilities, reviews } = tutor;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation Header */}
      <div className="sticky top-20 z-40 border-b border-border/50 bg-background/80 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/tutors" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to results
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-rose-500/30 hover:text-rose-500">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header Profile Info */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center lg:items-start">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-[3.5rem] bg-gradient-to-tr from-primary/40 to-secondary/40 opacity-70 blur-2xl" />
                <img
                  src={user.image || "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=900&auto=format&fit=crop"}
                  alt={user.name}
                  width={180}
                  height={180}
                  className="relative h-44 w-44 rounded-[3rem] border border-background object-cover shadow-2xl lg:h-52 lg:w-52"
                />
                {tutor.isApproved && (
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-background">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 lg:pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
                    {user.name}
                  </h1>
                  <span className="rounded-xl bg-muted px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Native Speaker
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg">{averageRating.toFixed(1)}</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">({totalReviews} reviews)</span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-border" />
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{experienceYears} Years Exp.</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {subjects.map(ts => (
                    <span key={ts.id} className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-bold text-primary shadow-sm shadow-primary/5">
                      <Zap className="h-3.5 w-3.5 fill-current" />
                      {ts.subject.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground">About Me</h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {bio}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <Languages className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Languages</p>
                      <p className="mt-1 font-bold text-foreground">
                        {languages.map(tl => tl.language.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Verified</p>
                      <p className="mt-1 font-bold text-foreground">Background Checked</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Availability Section */}
            <section id="availability">
              <AvailabilityGrid availabilities={availabilities} />
            </section>

            {/* Reviews Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Student Reviews</h2>
                <div className="flex items-center gap-2">
                  <button className="text-sm font-bold text-primary hover:underline underline-offset-4">See all reviews</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="rounded-[2.5rem] border border-border/70 bg-card p-8 shadow-sm transition-all hover:border-primary/30">
                      <div className="flex items-start gap-4">
                        <img 
                          src={review.student.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"} 
                          alt={review.student.name}
                          className="h-12 w-12 rounded-2xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-foreground">{review.student.name}</h4>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="mt-4 text-muted-foreground leading-relaxed italic">
                            "{review.comment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2.5rem] border border-dashed border-border p-12 text-center text-muted-foreground">
                    No reviews yet. Be the first to book with {user.name.split(" ")[0]}!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bottom-12 space-y-6">
              <div className="overflow-hidden rounded-[3rem] border-4 border-primary/10 bg-card p-8 shadow-2xl shadow-primary/10">
                <div className="flex items-end justify-between border-b border-border/50 pb-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Hourly Rate</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-foreground">${Number(hourlyRate).toFixed(0)}</span>
                      <span className="text-lg font-bold text-muted-foreground">.{(Number(hourlyRate) % 1).toFixed(2).split(".")[1]}</span>
                      <span className="ml-1 text-sm font-bold text-muted-foreground">/ hr</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full">Best Value</p>
                  </div>
                </div>

                <div className="space-y-4 py-8">
                  <button className="flex w-full items-center justify-center gap-3 rounded-[1.75rem] bg-primary py-5 text-lg font-black text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]">
                    Book Now
                  </button>
                  <button className="flex w-full items-center justify-center gap-3 rounded-[1.75rem] border border-border bg-card py-5 text-lg font-bold text-card-foreground transition-all hover:border-primary/30 hover:bg-muted">
                    <MessageCircle className="h-5 w-5" />
                    Contact Tutor
                  </button>
                </div>

                <div className="space-y-4 rounded-3xl bg-muted/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-5 w-5 shrink-0 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-foreground">
                      Reschedule anytime up to 12 hours before.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-5 w-5 shrink-0 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-foreground">
                      Secure payments handled by Stripe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/50 text-amber-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Identity Verified</h4>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">TutorByte Authenticated</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}