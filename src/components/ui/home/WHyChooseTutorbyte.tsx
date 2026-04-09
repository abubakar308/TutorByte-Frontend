import {
  ShieldCheck,
  Sparkles,
  CalendarClock,
  Globe2,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function WhyChooseTutorByteSection() {
  const features = [
    {
      title: "Verified Tutors",
      description:
        "Learn with trusted educators whose profiles, subjects, and teaching details are carefully reviewed for quality and reliability.",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Smart Tutor Discovery",
      description:
        "Quickly find tutors by subject, language, price, and ratings with a search experience designed to make matching easier.",
      icon: Sparkles,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      title: "Flexible Scheduling",
      description:
        "Book sessions around your personal routine with availability-aware scheduling that keeps learning convenient and manageable.",
      icon: CalendarClock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Multilingual Learning",
      description:
        "Choose tutors who teach in your preferred language so lessons feel more natural, clear, and comfortable.",
      icon: Globe2,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Real Reviews & Ratings",
      description:
        "Explore feedback from students to better understand tutor quality, teaching style, and overall learner experience.",
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-indigo-500 to-violet-500 py-24 text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <h2 className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary-foreground/80">
            <span className="h-px w-8 bg-primary-foreground/40"></span>
            Why Choose TutorByte
          </h2>

          <h3 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            A modern tutoring platform built for trust, flexibility, and better learning outcomes.
          </h3>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            TutorByte helps students discover reliable tutors, book with confidence,
            and learn in a way that feels simple, personalized, and effective.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {features.slice(0, 4).map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} ${feature.color} bg-white/15 text-primary-foreground transition-all duration-300 group-hover:scale-105`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h4 className="text-xl font-bold tracking-tight">
                    {feature.title}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="rounded-[2.25rem] border border-white/15 bg-white/10 p-8 shadow-xl backdrop-blur-sm lg:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-primary-foreground">
                <Star className="h-6 w-6" />
            </div>

            <h4 className="text-2xl font-black tracking-tight lg:text-3xl">
              {features[4].title}
            </h4>

            <p className="mt-4 text-sm leading-7 text-primary-foreground/80">
              {features[4].description}
            </p>

            <div className="mt-8 space-y-4 rounded-[1.75rem] bg-white/10 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
                <p className="text-sm leading-6 text-primary-foreground/85">
                  Compare tutor ratings before booking a session.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
                <p className="text-sm leading-6 text-primary-foreground/85">
                  Read recent feedback from real students.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
                <p className="text-sm leading-6 text-primary-foreground/85">
                  Make more confident decisions with transparent tutor profiles.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
              >
                Explore Tutors
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}