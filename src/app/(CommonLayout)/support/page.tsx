import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Headphones,
  LifeBuoy,
  MessageCircleMore,
  ShieldCheck,
  UserCog,
} from "lucide-react";

const supportOptions = [
  {
    icon: Headphones,
    title: "Platform Assistance",
    description:
      "Get support for account access, dashboard usage, and general platform navigation.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Support",
    description:
      "Need help with session scheduling, tutor booking, or managing your learning plan? Start here.",
  },
  {
    icon: GraduationCap,
    title: "Tutor Support",
    description:
      "Receive guidance on tutor profile setup, availability, and approval-related questions.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Trust",
    description:
      "Report issues, ask about verification, and understand how TutorByte builds a secure learning environment.",
  },
];

const supportSteps = [
  {
    icon: MessageCircleMore,
    title: "Tell us your issue",
    description:
      "Share your support request with a clear subject and message so we can help you faster.",
  },
  {
    icon: UserCog,
    title: "Our team reviews it",
    description:
      "We review your request and identify the best next step based on your account type and issue category.",
  },
  {
    icon: BellRing,
    title: "Get an update",
    description:
      "You receive a response with guidance, action steps, or clarification depending on the issue.",
  },
];

export default function SupportPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <LifeBuoy className="h-3.5 w-3.5" />
              Support Center
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Dedicated support for students, tutors, and platform users.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              TutorByte support is designed to help you solve issues quickly,
              understand the platform better, and keep your learning experience smooth.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Support Areas
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Choose the area where you need help.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We designed support options for the most common TutorByte workflows and questions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {supportOptions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              How Support Works
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              A clear and helpful support flow.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              TutorByte support aims to be simple, responsive, and easy to understand.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {supportSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-[2rem] border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Common Support Paths
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Help with tutor booking and session setup",
                "Assistance with account access and dashboard usage",
                "Tutor onboarding and availability guidance",
                "General questions about how TutorByte works",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border/70 p-4"
                >
                  <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Need more help?
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">
              Contact the TutorByte team directly.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              If your issue needs direct attention, use our contact page and share your details clearly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}