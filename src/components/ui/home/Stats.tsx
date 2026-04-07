"use client";

import { ShieldCheck, Users, Star, BookOpen } from "lucide-react";

const stats = [
  { label: "Verified Tutors", value: "1,200+", icon: ShieldCheck },
  { label: "Active Students", value: "15K+", icon: Users },
  { label: "Success Rate", value: "98%", icon: Star },
  { label: "Subjects Covered", value: "100+", icon: BookOpen },
];

export default function StatsSection() {
  return (
    <section className="relative z-20 mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/75 p-4 shadow-xl shadow-primary/5 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:p-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="rounded-2xl border border-border/60 bg-background/70 p-4 transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black tracking-tight text-foreground">{item.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{item.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
