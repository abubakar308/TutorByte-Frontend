"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
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

type NavItem = {
  href: string;
  label: string;
};

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

const publicNavLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Find Tutors" },
  { href: "/subjects", label: "Subjects" },
  { href: "/about", label: "About Us" },
];

const studentNavLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Find Tutors" },
  { href: "/dashboard/bookings", label: "My Bookings" },
  { href: "/dashboard", label: "Dashboard" },
];

const tutorNavLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Find Tutors" },
  { href: "/dashboard/sessions", label: "My Sessions" },
  { href: "/dashboard", label: "Dashboard" },
];

const adminNavLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Find Tutors" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About Us" },
];

const publicMoreLinks: NavItem[] = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help Center" },
];

const studentMoreLinks: NavItem[] = [
  { href: "/support", label: "Support" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help Center" },
];

const tutorMoreLinks: NavItem[] = [
  { href: "/dashboard/availability", label: "Availability" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help Center" },
];

const adminMoreLinks: NavItem[] = [
  { href: "/support", label: "Support" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help Center" },
];

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const cfg = user?.role ? roleConfig[user.role] : null;

  const currentNavLinks = useMemo(() => {
    if (!user) return publicNavLinks;
    if (user.role === "STUDENT") return studentNavLinks;
    if (user.role === "TUTOR") return tutorNavLinks;
    return adminNavLinks;
  }, [user]);

  const currentMoreLinks = useMemo(() => {
    if (!user) return publicMoreLinks;
    if (user.role === "STUDENT") return studentMoreLinks;
    if (user.role === "TUTOR") return tutorMoreLinks;
    return adminMoreLinks;
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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

      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const closeAllMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    setMoreOpen(false);
    setMobileMoreOpen(false);
    setSearchOpen(false);
  };

  const handleNavClick = () => {
    closeAllMenus();
  };

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
      closeAllMenus();
      router.push("/");
      router.refresh();
    });
  };

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
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
            {currentNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActiveRoute(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  moreOpen
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                More
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {moreOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/10 animate-in fade-in zoom-in-95 duration-200">
                  {currentMoreLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className="block rounded-xl px-3 py-2 text-sm text-card-foreground transition hover:bg-muted hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              aria-label="Toggle theme"
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
                  onClick={handleNavClick}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-primary/5 hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={handleNavClick}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <div className="ml-1 flex items-center gap-2">
                <button
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-3 py-2 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="user"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>

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
                    <div className="absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10 animate-in fade-in zoom-in-95 duration-200">
                      <div className="border-b border-border/60 px-4 py-3">
                        <p className="line-clamp-1 text-sm font-semibold text-card-foreground">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {cfg?.label} Account
                        </p>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href={cfg?.dashboard || "/dashboard"}
                          onClick={handleNavClick}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"
                        >
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          Dashboard
                        </Link>

                        <Link
                          href="/profile"
                          onClick={handleNavClick}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          My Profile
                        </Link>

                        <Link
                          href="/dashboard/notifications"
                          onClick={handleNavClick}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"
                        >
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          Notifications
                        </Link>

                        <Link
                          href="/settings"
                          onClick={handleNavClick}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-card-foreground transition hover:bg-muted"
                        >
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          Settings
                        </Link>

                        {user.role === "STUDENT" && (
                          <Link
                            href="/become-tutor"
                            onClick={handleNavClick}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/10"
                          >
                            <GraduationCap className="h-4 w-4" />
                            Become a Tutor
                          </Link>
                        )}
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
              aria-label="Toggle theme"
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
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background/98 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
              {currentNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActiveRoute(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={() => setMobileMoreOpen((prev) => !prev)}
                className="mt-1 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-muted"
              >
                <span>More</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileMoreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileMoreOpen && (
                <div className="ml-2 space-y-1">
                  {currentMoreLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className="block rounded-xl px-4 py-2.5 text-sm text-foreground/75 transition hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-2 border-t border-border pt-3">
                {!user ? (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={handleNavClick}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={handleNavClick}
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                    >
                      Get started
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href={cfg?.dashboard || "/dashboard"}
                      onClick={handleNavClick}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={handleNavClick}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      My Profile
                    </Link>

                    <Link
                      href="/dashboard/notifications"
                      onClick={handleNavClick}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      Notifications
                    </Link>

                    <Link
                      href="/settings"
                      onClick={handleNavClick}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </Link>

                    {user.role === "STUDENT" && (
                      <Link
                        href="/become-tutor"
                        onClick={handleNavClick}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Become a Tutor
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(
                      `/tutors?search=${encodeURIComponent(searchQuery)}`
                    );
                    closeAllMenus();
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search tutors by name or expertise..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-md border border-border px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground"
              >
                ESC
              </button>
            </div>

            <div className="space-y-2 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Links
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  href="/tutors?subject=web-development"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Web Development Tutors
                </Link>

                <Link
                  href="/tutors?subject=english"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  English Tutors
                </Link>

                <Link
                  href="/tutors?language=bangla"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Bangla Speaking Tutors
                </Link>

                <Link
                  href="/help"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}