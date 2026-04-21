import Link from "next/link";
import { ArrowRight, CalendarCheck, Search, Users, Video } from "lucide-react";

type HowItWorksStep = {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
};

type HowItWorksContent = {
  heroTitle: string;
  heroDescription: string;
  steps: HowItWorksStep[];
};

async function getHowItWorksContent(): Promise<HowItWorksContent | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return null;

    const res = await fetch(`${baseUrl}/page-content/how-it-works`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch how it works content");
    }

    const result = await res.json();
    return result?.data || null;
  } catch (error) {
    console.error("How it works fetch error:", error);
    return null;
  }
}

const icons = [Search, CalendarCheck, Video, Users];

export default async function HowItWorksPage() {
  const content = await getHowItWorksContent();

  const defaultSteps: HowItWorksStep[] = [
    {
      id: "1",
      stepNumber: 1,
      title: "Search tutors",
      description:
        "Browse tutors by subject, language, price, ratings, and availability to find the right educator.",
    },
    {
      id: "2",
      stepNumber: 2,
      title: "Pick a suitable time",
      description:
        "Review tutor availability and choose a session time that fits your study routine.",
    },
    {
      id: "3",
      stepNumber: 3,
      title: "Learn and grow",
      description:
        "Join your session, improve your skills, and move forward with guided one-to-one learning.",
    },
  ];

  const steps = content?.steps?.length ? content.steps : defaultSteps;
  const heroTitle =
    content?.heroTitle ||
    "A simple and structured learning flow from discovery to growth.";
  const heroDescription =
    content?.heroDescription ||
    "TutorByte makes it easy for students to discover tutors, book sessions, and continue learning with confidence.";

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Users className="h-3.5 w-3.5" />
              How TutorByte Works
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {heroDescription}
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Step-by-step journey
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Follow a clear path from tutor discovery to successful learning.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            TutorByte is designed to keep the full tutoring experience simple, modern, and easy to follow.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = icons[index] || Search;

            return (
              <div
                key={step.id}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    Step {step.stepNumber}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-3xl font-black tracking-tight">
              Why this flow works well for students
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
              <li>• Clear tutor discovery by subject, language, and skill.</li>
              <li>• Easy booking flow with availability-based selection.</li>
              <li>• More confidence before a session starts.</li>
              <li>• Better learning continuity through structured tutor matching.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <h2 className="text-3xl font-black tracking-tight">
              Ready to get started?
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Browse tutors, compare profiles, and start learning with an educator who matches your needs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Find Tutors
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Learn About TutorByte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}