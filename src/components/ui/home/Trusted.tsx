import { MessageCircle, Users, ShieldCheck, CheckCircle2 } from "lucide-react";

const trustPoints = [
  {
    title: "Personalized Matching",
    desc: "Find the perfect tutor based on subject, language, budget, and real-time availability.",
    icon: Users,
    color: "bg-blue-500/20 text-blue-200",
  },
  {
    title: "Clear Communication",
    desc: "Seamless scheduling, instant booking updates, and direct student-tutor messaging.",
    icon: MessageCircle,
    color: "bg-emerald-500/20 text-emerald-200",
  },
  {
    title: "Reliable Experience",
    desc: "Verified profiles, structured booking flows, and a 100% secure payment environment.",
    icon: ShieldCheck,
    color: "bg-amber-500/20 text-amber-200",
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-primary to-violet-700 py-24">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-25">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/75">
            <span className="h-px w-8 bg-primary-foreground/30"></span>
            Why TutorByte
            <span className="h-px w-8 bg-primary-foreground/30"></span>
          </h2>
          <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Built for trusted learning outcomes.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/80">
            From discovery to booking and progress tracking, TutorByte helps students and tutors
            collaborate in a secure, reliable, and human-centered way.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="tb-card group relative rounded-2xl border border-white/25 bg-white/12 p-7 backdrop-blur-md"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${point.color}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="relative">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">
                    {point.desc}
                  </p>
                </div>

                <div className="relative mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Process
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}