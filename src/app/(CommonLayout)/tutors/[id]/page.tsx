"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  MessageCircle,
  Loader2,
  BookOpen,
  CalendarDays,
  Timer,
  Star,
  Clock,
  ShieldCheck,
  Globe
} from "lucide-react";

import { getTutorById } from "@/services/tutors";
import AvailabilityGrid from "@/components/ui/tutors/AvailabilityGrid";
import { toast } from "sonner";
import { createBooking, CreateBookingRequest } from "@/services/student";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TutorDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        const res = await getTutorById(id);

        if (!res?.data) {
          toast.error("Failed to load tutor data.");
          return;
        }

        if (res.success && res.data) {
          setTutor(res.data);

          if (res.data.subjects?.length > 0) {
            setSelectedSubject(res.data.subjects[0].subject.id);
          }
        }
      } catch (error) {
        console.error("Error fetching tutor details:", error);
        toast.error("An error occurred while fetching tutor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [id]);

  const handleCreateBooking = async () => {
    if (!selectedSubject || !bookingDate || !startTime || !endTime) {
      toast.error("Please fill in all booking details.");
      return;
    }

    try {
      setIsBooking(true);

      const bookingPayload = {
        tutorId: id,
        subjectId: selectedSubject,
        bookingDate: new Date(bookingDate).toISOString(),
        startTime,
        endTime,
      };

      const res = await createBooking(bookingPayload as CreateBookingRequest);

      if (res.success && res.data) {
        toast.success("Booking created successfully!");
        router.push(`/payment/checkout?bookingId=${res.data.id}`);
      } else {
        toast.error(res.message || "Failed to create booking.");
      }
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error("A server error occurred. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="animate-pulse text-lg text-muted-foreground">
          Fetching tutor profile...
        </p>
      </div>
    );
  }

  if (!tutor) return <div className="py-20 text-center">Tutor not found</div>;

  const {
    bio,
    experienceYears,
    hourlyRate,
    averageRating,
    totalReviews,
    isApproved,
    user,
    subjects,
    languages,
    availabilities,
    reviews,
  } = tutor;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation Header Can Go Here */}

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Left Column: Main Content */}
          <div className="space-y-12 lg:col-span-2">
            
            {/* Profile Info */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center lg:items-start">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-[3.5rem] bg-gradient-to-tr from-primary/40 to-secondary/40 opacity-70 blur-2xl" />
                <img
                  src={user?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa1q_08JfYWirXMUJ5d0XdjdvrGUpa5mgTQ&s"}
                  alt={user?.name}
                  className="relative h-44 w-44 rounded-[3rem] border border-background object-cover shadow-2xl lg:h-52 lg:w-52"
                />
              </div>
              <div className="flex-1 lg:pt-4">
                <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
                  {user?.name}
                </h1>
                
                <div className="mt-4 flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{averageRating > 0 ? averageRating.toFixed(1) : "New"}</span>
                    <span className="opacity-60">({totalReviews} reviews)</span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span>{experienceYears} Years Exp.</span>
                  </div>

                  {/* Verified Badge */}
                  {isApproved && (
                    <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-green-600">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verified Tutor</span>
                    </div>
                  )}
                </div>

                {/* Subjects */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {subjects?.map((s: any) => (
                    <span
                      key={s.subject.id}
                      className="flex items-center gap-1.5 rounded-xl bg-muted px-4 py-2 text-sm font-bold text-foreground"
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      {s.subject.name}
                    </span>
                  ))}
                </div>

                {/* Languages */}
                {languages && languages.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-muted-foreground">Speaks:</span>
                    {languages.map((lang: any, index: number) => (
                      <span key={index} className="rounded-md bg-secondary/20 px-2 py-1 text-xs font-semibold text-secondary-foreground">
                        {lang.language?.name || lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* About / Bio Section */}
            {bio && (
              <section id="about" className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                    About Me
                  </h2>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="rounded-3xl bg-card p-6 border border-border/50 shadow-sm">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {bio}
                  </p>
                </div>
              </section>
            )}

            {/* Availability Grid */}
            <section id="availability" className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                  Schedule
                </h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <AvailabilityGrid availabilities={availabilities || []} />
            </section>

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <section id="reviews" className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                    Student Reviews
                  </h2>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {reviews.map((review: any, idx: number) => (
                    <div key={idx} className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {review.studentName?.charAt(0) || "S"}
                          </div>
                          <span className="font-bold text-sm">{review.studentName || "Student"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-sm font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column: Booking Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-[3rem] border-4 border-primary/10 bg-card p-8 shadow-2xl shadow-primary/10">
                {/* Hourly Rate */}
                <div className="flex items-end justify-between border-b border-border/50 pb-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Hourly Rate
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-foreground">
                        ${Number(hourlyRate).toFixed(0)}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        / hr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Inputs Area */}
                <div className="space-y-5 py-8">
                  {/* Subject Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Select Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-muted/50 p-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {subjects?.map((s: any) => (
                        <option key={s.subject.id} value={s.subject.id}>
                          {s.subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <CalendarDays className="h-3 w-3" /> Booking Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-muted/50 p-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Timer className="h-3 w-3" /> Start
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-muted/50 p-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Timer className="h-3 w-3" /> End
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-muted/50 p-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleCreateBooking}
                    disabled={isBooking}
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.75rem] bg-primary py-5 text-lg font-black text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isBooking ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      "Book a Lesson"
                    )}
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
                      Secure payment and 100% satisfaction guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}