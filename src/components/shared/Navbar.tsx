"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
import { logOut } from "@/services/auth";

type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

interface NavbarUser {
  name?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
}

interface NavbarProps {
  user: NavbarUser | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Tutors" },
  { href: "/subjects", label: "Subjects" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

const roleConfig: Record<
  UserRole,
  { label: string; dashboard: string; color: string }
> = {
  STUDENT: {
    label: "Student",
    dashboard: "/dashboard",
    color: "text-secondary",
  },
  TUTOR: {
    label: "Tutor",
    dashboard: "/dashboard",
    color: "text-emerald-500",
  },
  ADMIN: {
    label: "Admin",
    dashboard: "/dashboard",
    color: "text-rose-500",
  },
};

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const cfg = user?.role ? roleConfig[user.role] : null;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = !darkMode;
    setDarkMode(next);

    if (next) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logOut();
      router.push("/");
      router.refresh();
    });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-border/80 bg-background/95 shadow-sm backdrop-blur-xl"
            : "border-border/40 bg-background/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[15px] font-bold leading-none tracking-tight text-foreground">
                TutorByte
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Learn · Book · Grow
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-primary/5 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {!user ? (
              <div className="ml-1 flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-primary/5 hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <div className="ml-1 flex items-center gap-2">
                <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-3 py-2 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || "user"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="hidden text-left sm:block">
                      <p className="text-[13px] font-semibold leading-none text-card-foreground">
                        {user.name?.split(" ")[0] || "User"}
                      </p>
                      <p className={`mt-1 text-[11px] font-medium ${cfg?.color}`}>
                        {cfg?.label}
                      </p>
                    </div>

                    <ChevronDown
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10">
                      <div className="border-b border-border/60 px-4 py-3">
                        <p className="text-sm font-semibold text-card-foreground">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {cfg?.label} account
                        </p>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"
                        >
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          Dashboard
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          My Profile
                        </Link>
                      </div>

                      <div className="border-t border-border/60 p-1.5">
                        <button
                          onClick={handleLogout}
                          disabled={isPending}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 transition hover:bg-rose-50 disabled:opacity-70 dark:hover:bg-rose-950/20"
                        >
                          <LogOut className="h-4 w-4" />
                          {isPending ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background/98 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-border pt-3">
                {!user ? (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Get started
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href={user?.role === "ADMIN" ? "/admin/dashboard" : user?.role === "TUTOR" ? "/tutor/dashboard" : "/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground transition hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground transition hover:bg-muted"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-rose-500 transition hover:bg-rose-50 disabled:opacity-70 dark:hover:bg-rose-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      {isPending ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/tutors?search=${encodeURIComponent(searchQuery)}`);
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search tutors, subjects, languages..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted"
              >
                ESC
              </button>
            </div>

            <div className="p-3">
              <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Popular subjects
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mathematics",
                  "Physics",
                  "English",
                  "Python",
                  "Spanish",
                  "Design",
                  "Chemistry",
                ].map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      router.push(`/tutors?subject=${encodeURIComponent(subject)}`);
                      setSearchOpen(false);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}