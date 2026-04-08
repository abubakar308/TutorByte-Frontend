import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CalendarCheck,
  Globe2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const stats = [
  { label: "Verified Tutors", value: "1200+" },
  { label: "Active Students", value: "15K+" },
  { label: "Subjects Covered", value: "100+" },
  { label: "Learning Satisfaction", value: "98%" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trusted Learning Experience",
    description:
      "We focus on verified tutor profiles, structured booking flows, and a secure learning environment for students and educators.",
  },
  {
    icon: Brain,
    title: "Smart Matching",
    description:
      "TutorByte helps learners discover tutors by subject, language, availability, pricing, and learning goals.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Scheduling",
    description:
      "Students can explore availability and book sessions at times that fit their personal study routine.",
  },
  {
    icon: Globe2,
    title: "Inclusive & Multilingual",
    description:
      "We support learning across multiple languages so students can study in the language they understand best.",
  },
];

const steps = [
  {
    icon: Users,
    title: "Discover the right tutor",
    description:
      "Browse qualified tutors by expertise, language, ratings, and pricing to find the best fit.",
  },
  {
    icon: BookOpen,
    title: "Book with confidence",
    description:
      "Review tutor details, schedules, and session information before confirming your learning session.",
  },
  {
    icon: GraduationCap,
    title: "Learn and grow",
    description:
      "Attend sessions, track progress, and build confidence through structured one-to-one learning.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              About TutorByte
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Building a smarter way to connect students with the right tutors.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              TutorByte is a modern tutor booking platform designed to make learning
              more accessible, personalized, and reliable. We help students find
              trusted tutors based on subject, language, availability, and learning needs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tutors"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore Tutors
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-3xl font-black tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Our Mission
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Make expert learning simpler, more accessible, and more human.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              We believe students learn best when they can access the right educator
              at the right time in a way that feels natural and personalized.
              TutorByte combines clear tutor discovery, reliable booking, and
              learner-focused design into one streamlined experience.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Why TutorByte
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Verified tutor-first platform experience",
                "Subject and language-based tutor discovery",
                "Structured booking and session planning",
                "Modern UX with responsive design and dark mode",
                "Built to support both students and educators",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm leading-6 text-muted-foreground">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Our Core Values
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            What makes TutorByte a trusted learning platform.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We focus on product decisions that create real value for students,
            tutors, and administrators.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary via-indigo-500 to-violet-500 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground/80">
              How It Works
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              A simple learning journey from search to success.
            </h2>
            <p className="mt-4 text-base leading-7 text-primary-foreground/80">
              TutorByte is designed to keep the learning process clear, modern, and easy to follow.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Looking Ahead
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              We are building a more intelligent and learner-focused tutoring experience.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Our vision is to keep improving tutor discovery, personalized recommendations,
              and learning support so that every student can move forward with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}