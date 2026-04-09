import Link from "next/link";
import {
  MessageCircle,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const trustPoints = [
  {
    title: "Personalized Matching",
    desc: "Find the right tutor based on subject, language, budget, and real-time availability for a more relevant learning experience.",
    icon: Users,
    color: "bg-blue-500/20 text-blue-200",
  },
  {
    title: "Clear Communication",
    desc: "Enjoy seamless scheduling, direct booking updates, and a smoother connection between students and tutors.",
    icon: MessageCircle,
    color: "bg-emerald-500/20 text-emerald-200",
  },
  {
    title: "Reliable Experience",
    desc: "Learn with verified profiles, structured booking flows, and a secure system built for trust and consistency.",
    icon: ShieldCheck,
    color: "bg-amber-500/20 text-amber-200",
  },
];

export default function TrustSection() {
  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-primary to-violet-700 py-24"
    >
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/75">
            <span className="h-px w-8 bg-primary-foreground/30"></span>
            Why TutorByte
            <span className="h-px w-8 bg-primary-foreground/30"></span>
          </h2>

          <h3 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built for trusted learning outcomes.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            From discovery to booking and progress tracking, TutorByte helps
            students and tutors collaborate in a secure, reliable, and
            learner-focused way.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {trustPoints.map((point) => {
            const Icon = point.icon;

            return (
              <article
                key={point.title}
                className="group relative flex min-h-[280px] flex-col rounded-[2rem] border border-white/20 bg-white/10 p-7 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
              >
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div
                  className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${point.color} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="relative flex-1">
                  <h4 className="text-xl font-bold tracking-tight text-white">
                    {point.title}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-primary-foreground/85">
                    {point.desc}
                  </p>
                </div>

                <div className="relative mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Process
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
          >
            Explore Tutors
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}