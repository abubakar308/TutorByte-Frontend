import { BookOpen, Globe2, GraduationCap } from "lucide-react";

const categories = [
  {
    title: "Languages",
    icon: Globe2,
    desc: "English, IELTS, Spanish, Arabic",
  },
  {
    title: "Academics",
    icon: GraduationCap,
    desc: "Math, Physics, Chemistry, Biology",
  },
  {
    title: "Skills",
    icon: BookOpen,
    desc: "Programming, Design, Communication",
  },
];

export default function CategoriesSection() {

    
  return (
    <section id="subjects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Explore learning paths
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Choose from languages, academics, and real-world skills.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">
                {category.title}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {category.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}