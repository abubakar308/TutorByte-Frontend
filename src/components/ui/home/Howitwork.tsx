import Link from "next/link";
import { Search, CalendarClock, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Search Tutors",
      desc: "Browse expert tutors by subject, language, price, and rating using smart filters tailored to your learning goals.",
      icon: Search,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pick a Time",
      desc: "Choose a tutor’s available time slot that fits your routine and book a session with confidence.",
      icon: CalendarClock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Learn Together",
      desc: "Join your lesson, track your progress, and grow through personalized one-to-one learning support.",
      icon: Sparkles,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
          <span className="h-px w-8 bg-primary/30"></span>
          How It Works
          <span className="h-px w-8 bg-primary/30"></span>
        </h2>

        <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          A simple way to search, book, and learn.
        </h3>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          TutorByte keeps the learning journey simple, guided, and student-friendly
          from the first search to the final session.
        </p>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="absolute left-[12%] right-[12%] top-1/3 -z-10 hidden h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent md:block" />

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="group relative flex min-h-[300px] flex-col items-center rounded-[2rem] border border-border/70 bg-card p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-primary/25 bg-background px-4 py-1 text-xs font-bold text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                STEP 0{index + 1}
              </div>

              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.bgColor} ${step.color} transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground`}
              >
                <Icon className="h-7 w-7" />
              </div>

              <h4 className="text-xl font-bold tracking-tight text-foreground">
                {step.title}
              </h4>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>

              {index < steps.length - 1 && (
                <div className="mt-8 md:hidden">
                  <ArrowRight className="h-6 w-6 rotate-90 text-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Start Exploring Tutors
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}