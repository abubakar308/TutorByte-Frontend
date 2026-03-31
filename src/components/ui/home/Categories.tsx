import Link from "next/link";
import { BookOpen, Globe2, GraduationCap } from "lucide-react";

const categories = [
  {
    title: "Languages",
    icon: Globe2,
    desc: "English, IELTS, Spanish, Arabic",
    href: "/tutors?category=LANGUAGE",
  },
  {
    title: "Mathematics",
    icon: GraduationCap,
    desc: "Calculus, Algebra, Geometry, Statistics",
    href: "/tutors?category=MATHEMATICS",
  },
  {
    title: "Engineering",
    icon: BookOpen,
    desc: "Physics, Mechanics, Electronics, Software",
    href: "/tutors?category=SCIENCE",
  },
];

export default function CategoriesSection() {
  return (
    <section id="subjects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">
          Explore learning paths
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Master any subject with <span className="text-primary italic">expert</span> guidance.
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              href={category.href}
              key={category.title}
              className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
              
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-black tracking-tight text-card-foreground">
                {category.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {category.desc}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary opacity-0 transition-all group-hover:opacity-100">
                Browse Tutors
                <span className="text-lg">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}