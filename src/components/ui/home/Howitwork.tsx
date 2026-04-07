import { Search, CalendarClock, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Search Tutors",
      desc: "Browse expert tutors by subject, language, price, and rating using our smart filters.",
      icon: Search,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pick a Time",
      desc: "Choose a tutor’s available time slot that perfectly fits your personal schedule.",
      icon: CalendarClock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Learn Together",
      desc: "Join the interactive session, track your progress, and grow with total confidence.",
      icon: Sparkles,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
          <span className="h-px w-8 bg-primary/30"></span>
          How It Works
          <span className="h-px w-8 bg-primary/30"></span>
        </h2>
        <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          A simple way to search, book, and learn.
        </h3>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="absolute left-0 top-1/3 -z-10 hidden w-full border-t border-dashed border-border/60 md:block" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="group relative flex min-h-[280px] flex-col items-center rounded-2xl border border-border/70 bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-4 py-1 text-xs font-bold text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                STEP 0{index + 1}
              </div>

              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.bgColor} ${step.color} transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground`}>
                <Icon className="h-7 w-7" />
              </div>

              <h4 className="text-xl font-bold tracking-tight text-foreground">
                {step.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
    </section>
  );
}