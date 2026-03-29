import {Search, CalendarClock, Sparkles } from "lucide-react"


export default function HowItWorksSection() {

    
const steps = [
  {
    title: "Search Tutors",
    desc: "Browse expert tutors by subject, language, price, and rating.",
    icon: Search,
  },
  {
    title: "Pick a Time",
    desc: "Choose a tutor’s available time slot that fits your schedule.",
    icon: CalendarClock,
  },
  {
    title: "Learn Together",
    desc: "Join the session, track your progress, and grow with confidence.",
    icon: Sparkles,
  },
];



  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          A smoother way to connect, book, and learn.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-4xl font-black text-border">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">
                {step.title}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
