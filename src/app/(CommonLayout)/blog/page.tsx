import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Sparkles,
  TrendingUp,
  User2,
} from "lucide-react";

const featuredPost = {
  title: "How to Choose the Right Tutor for Your Learning Goals",
  description:
    "Discover practical strategies for evaluating tutor profiles, comparing skills, checking availability, and finding the right learning match for your goals.",
  category: "Student Guide",
  author: "TutorByte Team",
  date: "April 8, 2026",
  readTime: "6 min read",
};

const blogPosts = [
  {
    title: "5 Signs a Tutor Profile Builds Trust Instantly",
    description:
      "Learn what makes a tutor profile stand out, from qualifications and bio clarity to ratings, language support, and structured availability.",
    category: "Tutor Tips",
    author: "TutorByte Editorial",
    date: "April 6, 2026",
    readTime: "4 min read",
  },
  {
    title: "How Online Tutoring Helps Students Stay Consistent",
    description:
      "Explore how flexible scheduling, one-to-one support, and personalized lesson pacing improve confidence and learning progress.",
    category: "Learning Insights",
    author: "TutorByte Team",
    date: "April 4, 2026",
    readTime: "5 min read",
  },
  {
    title: "Improving Your Tutor Profile to Get More Bookings",
    description:
      "A practical guide for tutors on creating stronger bios, setting availability, selecting subjects, and improving profile trust signals.",
    category: "Tutor Growth",
    author: "TutorByte Editorial",
    date: "April 2, 2026",
    readTime: "7 min read",
  },
  {
    title: "Why Language-Based Tutor Discovery Matters",
    description:
      "Students learn better when they understand clearly. This article explores the value of finding tutors who teach in preferred languages.",
    category: "Platform Insight",
    author: "TutorByte Team",
    date: "March 30, 2026",
    readTime: "5 min read",
  },
  {
    title: "A Better Booking Experience Starts with Clear Availability",
    description:
      "See how accurate schedules help students book faster and help tutors manage sessions more effectively.",
    category: "Product Design",
    author: "TutorByte Product",
    date: "March 28, 2026",
    readTime: "4 min read",
  },
  {
    title: "What Students Should Check Before Booking a Session",
    description:
      "From pricing and subject fit to reviews and session times, here is a simple checklist for confident tutor booking.",
    category: "Student Guide",
    author: "TutorByte Team",
    date: "March 25, 2026",
    readTime: "6 min read",
  },
];

const categories = [
  "All Posts",
  "Student Guide",
  "Tutor Tips",
  "Learning Insights",
  "Tutor Growth",
  "Platform Insight",
  "Product Design",
];

export default function BlogPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              TutorByte Blog
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Insights, guides, and ideas to support better learning.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explore articles for students, tutors, and platform users covering
              tutor selection, learning tips, booking best practices, and product insights.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                Featured Article
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                {featuredPost.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {featuredPost.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {featuredPost.category}
                </span>
                <span className="inline-flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  {featuredPost.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {featuredPost.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {featuredPost.readTime}
                </span>
              </div>

              <Link
                href="/blog/how-to-choose-the-right-tutor"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-border bg-muted/40 p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Popular Categories
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      category === "All Posts"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-sm leading-6 text-muted-foreground">
                Browse learning guides, tutor growth articles, and platform-focused updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Latest Articles
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Fresh content for students and tutors.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Practical posts designed to help users learn more effectively and use TutorByte better.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="group rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  <span className="rounded-full bg-primary/10 px-3 py-1">
                    {post.category}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight transition group-hover:text-primary">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {post.description}
                </p>

                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link
                  href="/blog/sample-post"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}