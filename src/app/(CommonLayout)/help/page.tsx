import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CircleHelp,
  FileText,
  LifeBuoy,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const helpCategories = [
  {
    icon: CircleHelp,
    title: "Getting Started",
    description:
      "Learn how TutorByte works, how to explore tutors, and how to start your learning journey smoothly.",
    link: "/how-it-works",
    cta: "See how it works",
  },
  {
    icon: UserCheck,
    title: "Account & Profile",
    description:
      "Manage your account details, profile information, and platform settings with confidence.",
    link: "/settings",
    cta: "Manage settings",
  },
  {
    icon: BookOpenCheck,
    title: "Bookings & Sessions",
    description:
      "Understand how to book sessions, track tutor availability, and manage your learning schedule.",
    link: "/tutors",
    cta: "Browse tutors",
  },
  {
    icon: ShieldCheck,
    title: "Platform Trust & Safety",
    description:
      "Read about verified tutors, responsible usage, and how TutorByte supports a trusted learning environment.",
    link: "/about",
    cta: "Learn more",
  },
];

const faqs = [
  {
    question: "How do I find the right tutor?",
    answer:
      "Use the tutor explore page to filter by subject, language, price, rating, and availability. This helps you quickly find tutors that match your learning goals.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Visit a tutor’s details page, review their profile and availability, then select a suitable schedule and confirm your booking.",
  },
  {
    question: "Can I become a tutor on TutorByte?",
    answer:
      "Yes. If you want to teach on TutorByte, complete your tutor profile and submit the required information for approval.",
  },
  {
    question: "What if I need support with my account?",
    answer:
      "You can use the contact page or support route to reach the TutorByte team for account issues, platform guidance, or booking help.",
  },
  {
    question: "Does TutorByte support different languages?",
    answer:
      "Yes. TutorByte is designed to help students discover tutors who can teach in preferred languages for a more comfortable learning experience.",
  },
  {
    question: "Where can I read updates and learning tips?",
    answer:
      "Visit the TutorByte blog to explore student guides, tutor growth content, and product-focused articles.",
  },
];

export default function HelpPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <LifeBuoy className="h-3.5 w-3.5" />
              Help Center
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Find answers, guidance, and support for TutorByte.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explore quick help topics, common questions, and platform guidance
              for students, tutors, and administrators.
            </p>

            <div className="mt-8 max-w-xl rounded-[1.5rem] border border-border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search help topics..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Help Topics
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Start with the area where you need support.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            These quick entry points help you navigate the most important areas of the platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {helpCategories.map((item) => {
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

                <Link
                  href={item.link}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Frequently Asked Questions
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Common questions from TutorByte users.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Find quick answers related to tutor discovery, bookings, account access, and platform support.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold tracking-tight">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-black tracking-tight">
                Need personal support?
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Reach out through our contact page if you need help with bookings,
                platform guidance, or account-related issues.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Contact Support
              </Link>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-black tracking-tight">
                Explore more resources
              </h3>
              <div className="mt-5 space-y-3">
                <Link
                  href="/blog"
                  className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <span>Visit Blog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/about"
                  className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <span>About TutorByte</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/tutors"
                  className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <span>Browse Tutors</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-tight">
                Quick contact
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Email us directly for help and platform support.
              </p>
              <p className="mt-4 text-sm font-semibold text-foreground">
                support@tutorbyte.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}