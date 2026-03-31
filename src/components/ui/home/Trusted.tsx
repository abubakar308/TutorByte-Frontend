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
    <section id="trust" className="relative bg-primary py-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute left-0 top-0 h-full w-full opacity-10 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary-foreground/60 mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-primary-foreground/30"></span>
            Why TutorByte
            <span className="h-px w-8 bg-primary-foreground/30"></span>
          </h2>
          <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            We prioritize your <span className="italic opacity-80">success</span> and safety.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div 
                key={index}
                className="group relative rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${point.color}`}>
                  <Icon className="h-7 w-7" />
                </div>

                <div className="relative">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {point.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-primary-foreground/70">
                    {point.desc}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <CheckCircle2 className="h-3 w-3" />
                  Standard Process
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}