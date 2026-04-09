import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, User2, BookOpen } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    slug: "how-to-choose-the-right-tutor",
    title: "How to Choose the Right Tutor for Your Learning Goals",
    description:
      "Learn how to compare tutor profiles, teaching styles, subject fit, and availability before booking your first session.",
    category: "Student Guide",
    author: "TutorByte Team",
    date: "April 8, 2026",
    readTime: "6 min read",
  },
  {
    id: "2",
    slug: "how-online-tutoring-improves-consistency",
    title: "How Online Tutoring Helps Students Stay Consistent",
    description:
      "Explore how flexible schedules, one-to-one sessions, and tutor support improve confidence and learning progress.",
    category: "Learning Insights",
    author: "TutorByte Editorial",
    date: "April 6, 2026",
    readTime: "5 min read",
  },
  {
    id: "3",
    slug: "improving-your-tutor-profile-for-more-bookings",
    title: "Improving Your Tutor Profile to Get More Bookings",
    description:
      "A practical guide for tutors on stronger bios, better availability, and profile trust signals that attract more students.",
    category: "Tutor Growth",
    author: "TutorByte Team",
    date: "April 4, 2026",
    readTime: "7 min read",
  },
];

export default function BlogPreviewSection() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
              <span className="h-px w-8 bg-primary/40"></span>
              Latest Articles
            </h2>

            <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Learning insights from the <span className="text-primary">TutorByte blog</span>.
            </h3>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Explore practical guides for students and tutors, platform tips, and expert content to improve your learning journey.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group flex h-full min-h-[340px] flex-col rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                {post.category}
              </div>

              <h4 className="mt-5 text-xl font-bold tracking-tight text-foreground transition group-hover:text-primary">
                {post.title}
              </h4>

              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
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
                href={`/blog/${post.slug}`}
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
  );
}