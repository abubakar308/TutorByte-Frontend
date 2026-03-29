"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, GraduationCap, Menu, Moon, Sun, User, LayoutDashboard, LogOut, X, Search, Bell, ChevronRight } from "lucide-react";
interface NavbarProps { user?: { name: string; role: "STUDENT"|"TUTOR"|"ADMIN"; avatarUrl?: string }|null; }
const navLinks = [{ href: "/tutors", label: "Find Tutors" }, { href: "/subjects", label: "Subjects" }, { href: "/how-it-works", label: "How It Works" }, { href: "/about", label: "About" }];
const roleConfig = { STUDENT: { label: "Student", dashboard: "/student/dashboard", color: "text-secondary" }, TUTOR: { label: "Tutor", dashboard: "/tutor/dashboard", color: "text-emerald-500" }, ADMIN: { label: "Admin", dashboard: "/admin/dashboard", color: "text-rose-500" } };
export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const s = localStorage.getItem("theme"); if (s === "dark" || (!s && window.matchMedia("(prefers-color-scheme: dark)").matches)) { document.documentElement.classList.add("dark"); setDarkMode(true); } }, []);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 12); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const toggleTheme = () => { const html = document.documentElement; const n = !darkMode; setDarkMode(n); if (n) { html.classList.add("dark"); localStorage.setItem("theme","dark"); } else { html.classList.remove("dark"); localStorage.setItem("theme","light"); } };
  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };
  const cfg = user ? roleConfig[user.role] : null;
  return (<>
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-border/80 bg-background/95 backdrop-blur-xl shadow-sm" : "border-border/40 bg-background/80 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105"><GraduationCap className="h-5 w-5" /></div>
          <div className="hidden sm:block"><p className="text-[15px] font-bold tracking-tight text-foreground leading-none">TutorByte</p><p className="text-[11px] text-muted-foreground mt-0.5">Learn · Book · Grow</p></div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map(i => <Link key={i.href} href={i.href} className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:text-primary hover:bg-primary/5">{i.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={() => setSearchOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary hover:bg-primary/5"><Search className="h-4 w-4" /></button>
          <button onClick={toggleTheme} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary hover:bg-primary/5">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          {!user ? (
            <div className="flex items-center gap-2 ml-1">
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition hover:text-primary hover:bg-primary/5">Sign in</Link>
              <Link href="/register" className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90 hover:-translate-y-0.5">Get started</Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary hover:bg-primary/5"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" /></button>
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-3 py-2 shadow-sm transition hover:border-primary/30 hover:shadow-md">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">{user.name.charAt(0).toUpperCase()}</div>}
                  <div className="hidden text-left sm:block"><p className="text-[13px] font-semibold leading-none text-card-foreground">{user.name.split(" ")[0]}</p><p className={`mt-1 text-[11px] font-medium ${cfg?.color}`}>{cfg?.label}</p></div>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10">
                    <div className="px-4 py-3 border-b border-border/60"><p className="text-sm font-semibold text-card-foreground">{user.name}</p><p className="text-xs text-muted-foreground mt-0.5">{cfg?.label} account</p></div>
                    <div className="p-1.5">
                      <Link href={cfg?.dashboard||"/"} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"><LayoutDashboard className="h-4 w-4 text-muted-foreground" />Dashboard</Link>
                      <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"><User className="h-4 w-4 text-muted-foreground" />My Profile</Link>
                    </div>
                    <div className="p-1.5 border-t border-border/60"><button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/20"><LogOut className="h-4 w-4" />Sign out</button></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggleTheme} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <button onClick={() => setMobileOpen(p => !p)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-border bg-background/98 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map(i => <Link key={i.href} href={i.href} className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary transition" onClick={() => setMobileOpen(false)}>{i.label}</Link>)}
            <div className="mt-2 border-t border-border pt-3">
              {!user ? (
                <div className="flex gap-2">
                  <Link href="/auth/login" className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground hover:bg-muted transition">Sign in</Link>
                  <Link href="/auth/register" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Get started</Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link href={cfg?.dashboard||"/"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-muted transition"><LayoutDashboard className="h-4 w-4 text-muted-foreground" />Dashboard</Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"><LogOut className="h-4 w-4" />Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    {searchOpen && (
      <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4" onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
        <div className="relative w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) window.location.href = `/tutors?search=${encodeURIComponent(searchQuery)}`; if (e.key === "Escape") setSearchOpen(false); }} placeholder="Search tutors, subjects, languages..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            <button onClick={() => setSearchOpen(false)} className="text-xs text-muted-foreground border border-border rounded-md px-2 py-1 hover:bg-muted transition">ESC</button>
          </div>
          <div className="p-3">
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Popular subjects</p>
            <div className="flex flex-wrap gap-2">
              {["Mathematics","Physics","English","Python","Spanish","Design","Chemistry"].map(s => <button key={s} onClick={() => window.location.href=`/tutors?subject=${s}`} className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition">{s}</button>)}
            </div>
          </div>
        </div>
      </div>
    )}
  </>);
}
