"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  ArrowRight,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react";
import { getLanguages, Language } from "@/services/admin"; 
export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Language[]>([]);

  const [stats, setStats] = useState([
    { label: "Verified Tutors", value: "1,200+", icon: ShieldCheck },
    { label: "Active Students", value: "15K+", icon: Users },
    { label: "Success Rate", value: "99%", icon: Star },
    { label: "Subjects", value: "100+", icon: CheckCircle2 },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getLanguages();
          const langArr = res?.data;
setCategories(Array.isArray(langArr) ? langArr : []);
    };
    fetchCategories();

  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/tutors");
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-10">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.12),transparent_30%),radial-gradient(circle_at_top_left,rgba(6,182,212,0.1),transparent_28%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Direct Access to Global Expertise
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl lg:leading-[1.1]">
            Elevate your <span className="text-primary italic">learning</span> with top experts.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            TutorByte is a premium marketplace connecting ambitious students with
            hand-picked, verified educators for personalized 1-on-1 sessions.
          </p>

          {/* Professional Call to Action - Buttons Removed as per request */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="Tutor"
                />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              <span className="font-bold text-foreground">500+ New students</span> joined this week
            </p>
          </div>

          {/* Professional Search Bar */}
          <div className="mt-12 max-w-2xl rounded-[2.5rem] border border-border bg-card/50 p-3 shadow-2xl shadow-primary/5 backdrop-blur-xl">
            <div className="grid gap-2 md:grid-cols-[1fr_180px_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-14 w-full rounded-2xl border-none bg-transparent pl-12 pr-4 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                  placeholder="What do you want to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              
              <div className="hidden md:block">
                <select className="h-14 w-full appearance-none rounded-xl border-none bg-transparent px-4 text-sm font-bold text-foreground/80 outline-none cursor-pointer">
                  <option value="">All Subjects</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="group h-14 rounded-2xl bg-primary px-8 font-black text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Search
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Dynamic Stats Grid */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group cursor-default">
                  <p className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {stat.value}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                    <Icon className="h-3 w-3 text-primary/60" />
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Visual Component */}
        <div className="relative z-10 hidden lg:block">
          <div className="relative mx-auto max-w-xl">
            {/* Floating Achievement Card */}
            <div className="absolute -left-16 top-20 z-20 rounded-3xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur-md animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-card-foreground">Secure Payments</p>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">100% Refund Policy</p>
                </div>
              </div>
            </div>

            {/* Main Image with Stylized Frame */}
            <div className="relative overflow-hidden rounded-[4rem] border-[12px] border-card bg-muted shadow-2xl shadow-primary/10">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="Expert Teaching"
                className="h-[650px] w-full object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Floating Booking Card */}
            <div className="absolute -bottom-8 -right-8 z-20 w-72 rounded-[2.5rem] border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-widest text-primary">Live Now</p>
                </div>
                <p className="font-bold text-card-foreground leading-snug">
                  Web Development session with Mr. Aris started 5 mins ago
                </p>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}