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
      {/* Section Header */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary/80 mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-primary/30"></span>
          Step-by-Step Guide
          <span className="h-px w-8 bg-primary/30"></span>
        </h2>
        <h3 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          A smoother way to <span className="text-primary italic">connect</span>, book, and learn.
        </h3>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        {/* Connecting Line (Desktop Only) */}
        <div className="absolute top-1/4 left-0 hidden w-full border-t-2 border-dashed border-border/50 md:block -z-10" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="group relative flex flex-col items-center text-center rounded-[2.5rem] border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-background border border-border px-4 py-1 text-xs font-black text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                STEP 0{index + 1}
              </div>

              {/* Icon with Dynamic Glow */}
              <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] ${step.bgColor} ${step.color} transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-inner`}>
                <Icon className="h-9 w-9" />
              </div>

              {/* Content */}
              <h4 className="text-2xl font-bold tracking-tight text-foreground">
                {step.title}
              </h4>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {step.desc}
              </p>

              {/* Connector Arrow for Mobile/Small Screens */}
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