"use client"

import { useState, useEffect, use } from "react";
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
  Loader2,
  XCircle,
  BookOpen
} from "lucide-react";

import { getTutorById } from "@/services/tutors";
import AvailabilityGrid from "@/components/ui/tutors/AvailabilityGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TutorDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [tutor, setTutor] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        const res = await getTutorById(id);
        if (res.success) {
          setTutor(res.data);
        }
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-lg">Fetching tutor profile...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center px-4">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
           <XCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Tutor not found</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          The tutor you're looking for doesn't exist or may have been removed.
        </p>
        <Link href="/tutors" className="mt-8 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground transition hover:bg-primary/90 shadow-lg shadow-primary/20">
          Back to Tutors
        </Link>
      </div>
    );
  }

  // ✅ ডিস্ট্রাকচারিং (Prisma include অনুযায়ী)
  const { 
    bio,
    experienceYears,
    hourlyRate,
    averageRating,
    totalReviews,
    isApproved,
    user,
    subjects, // Nested array: { subject: { id, name } }[]
    languages, // Nested array: { language: { id, name } }[]
    availabilities,
    reviews
  } = tutor;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 py-4 backdrop-blur-xl">
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
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Header Profile Info */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center lg:items-start">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-[3.5rem] bg-gradient-to-tr from-primary/40 to-secondary/40 opacity-70 blur-2xl" />
                <img
                  src={user?.image || "https://avatar.iran.liara.run/public"}
                  alt={user?.name}
                  className="relative h-44 w-44 rounded-[3rem] border border-background object-cover shadow-2xl lg:h-52 lg:w-52"
                />
                {isApproved && (
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-background">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 lg:pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
                    {user?.name}
                  </h1>
                  <span className="rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                    Verified Tutor
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg">{(averageRating || 0).toFixed(1)}</span>
                    <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">({totalReviews || 0} reviews)</span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-border" />
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{experienceYears} Years Experience</span>
                  </div>
                </div>

                {/* ✅ Subjects Section Added */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {subjects?.map((s: any) => (
                    <span key={s.subject.id} className="flex items-center gap-1.5 rounded-xl bg-muted px-4 py-2 text-sm font-bold text-foreground">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {s.subject.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground uppercase tracking-widest text-sm">About Me</h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                {bio}
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <Languages className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Languages</p>
                      <p className="mt-1 font-bold text-foreground">
                        {languages?.map((l: any) => l.language.name).join(", ") || "English"}
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
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Background Check</p>
                      <p className="mt-1 font-bold text-foreground">Identity Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Availability Section */}
            <section id="availability" className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground uppercase tracking-widest text-sm">Schedule</h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <AvailabilityGrid availabilities={availabilities || []} />
            </section>

            {/* Reviews Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground uppercase tracking-widest text-sm">Student Feedback</h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className="rounded-[2.5rem] border border-border/70 bg-card p-8 shadow-sm transition-all hover:border-primary/30">
                      <div className="flex items-start gap-4">
                        <img 
                          src={review.student?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.student?.name}`} 
                          alt={review.student?.name}
                          className="h-12 w-12 rounded-2xl object-cover bg-muted"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-foreground">{review.student?.name}</h4>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className="mt-4 text-muted-foreground leading-relaxed italic">
                            {review?.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2.5rem] border border-dashed border-border p-12 text-center text-muted-foreground bg-card/30">
                    No reviews yet. Be the first to book with {user?.name.split(" ")[0]}!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Booking Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-[3rem] border-4 border-primary/10 bg-card p-8 shadow-2xl shadow-primary/10">
                <div className="flex items-end justify-between border-b border-border/50 pb-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hourly Rate</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-foreground">${Number(hourlyRate).toFixed(0)}</span>
                      <span className="text-sm font-bold text-muted-foreground">/ hr</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1.5 rounded-full">Top Educator</p>
                  </div>
                </div>

                <div className="space-y-4 py-8">
                  <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.75rem] bg-primary py-5 text-lg font-black text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Book a Lesson
                  </button>
                  <button className="flex w-full items-center justify-center gap-3 rounded-[1.75rem] border border-border bg-card py-5 text-lg font-bold text-card-foreground transition-all hover:border-primary/30 hover:bg-muted">
                    <MessageCircle className="h-5 w-5" />
                    Send Message
                  </button>
                </div>

                <div className="space-y-4 rounded-3xl bg-muted/30 p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-xs font-bold leading-relaxed text-foreground">
                      Reschedule anytime up to 12 hours before.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-xs font-bold leading-relaxed text-foreground">
                      Satisfaction guaranteed or full refund.
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety/Verification Badge */}
              <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/50 text-amber-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Secure Booking</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stripe Protected</p>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}