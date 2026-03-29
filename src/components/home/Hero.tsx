import { CalendarClock, Search, ShieldCheck } from "lucide-react";

export default function HeroSection() {

    const stats = [
  { label: "Verified Tutors", value: "1,200+" },
  { label: "Sessions Booked", value: "18K+" },
  { label: "Student Satisfaction", value: "98%" },
  { label: "Countries Reached", value: "35+" },
];


  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.18),transparent_30%),radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="relative z-10">
          <div className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Trusted by students worldwide
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find the right tutor, book in minutes, and learn with confidence.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            TutorByte connects students with verified tutors for languages,
            academics, and in-demand skills through a smooth booking experience
            and modern learning interface.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-2xl bg-primary px-7 py-3 font-medium text-primary-foreground transition hover:bg-primary/90">
              Find a Tutor
            </button>
            <button className="rounded-2xl border border-border bg-card px-7 py-3 font-medium text-card-foreground transition hover:border-primary/30">
              Become a Tutor
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur">
            <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none"
                  placeholder="Search tutors, subjects, or skills"
                />
              </div>
              <input
                className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none"
                placeholder="Subject"
              />
              <input
                className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none"
                placeholder="Language"
              />
              <button className="h-12 rounded-2xl bg-secondary px-6 font-medium text-secondary-foreground transition hover:bg-secondary/90">
                Search
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-2xl font-bold tracking-tight text-card-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -left-6 top-10 hidden rounded-2xl border border-border bg-card p-4 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    Verified Tutors
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Safe and trusted profiles
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                alt="Students learning together"
                className="h-[520px] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 right-4 w-72 rounded-3xl border border-border bg-card p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-secondary/15 p-2 text-secondary">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">Easy Booking Flow</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick a tutor, choose a slot, and confirm your session in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}