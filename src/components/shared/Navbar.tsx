"use client"

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, GraduationCap, X, Menu, Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-card-foreground transition hover:bg-muted"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md"
      >
        <Image
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"
          alt="Profile"
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="hidden sm:block">
          <p className="text-sm font-semibold leading-none text-card-foreground">
            Abu Bakar
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Student</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <a
            href="#"
            className="block px-4 py-3 text-sm text-card-foreground transition hover:bg-muted"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-sm text-card-foreground transition hover:bg-muted"
          >
            My Profile
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-sm text-card-foreground transition hover:bg-muted"
          >
            Settings
          </a>
          <button className="block w-full px-4 py-3 text-left text-sm text-red-500 transition hover:bg-muted">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = true;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              TutorByte
            </p>
            <p className="text-xs text-muted-foreground">
              Learn Smarter, Book Faster
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm font-medium text-foreground/80 transition hover:text-primary">
            Home
          </a>
          <a href="#tutors" className="text-sm font-medium text-foreground/80 transition hover:text-primary">
            Tutors
          </a>
          <a href="#subjects" className="text-sm font-medium text-foreground/80 transition hover:text-primary">
            Subjects
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-foreground/80 transition hover:text-primary">
            How It Works
          </a>
          <a href="#reviews" className="text-sm font-medium text-foreground/80 transition hover:text-primary">
            Reviews
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!isLoggedIn ? (
            <>
              <button className="rounded-xl px-4 py-2 text-sm font-medium text-foreground transition hover:text-primary">
                Login
              </button>
              <button className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                Register
              </button>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-card-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            <a href="#home" className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
              Home
            </a>
            <a href="#tutors" className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
              Tutors
            </a>
            <a href="#subjects" className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
              Subjects
            </a>
            <a href="#how-it-works" className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
              How It Works
            </a>
            <a href="#reviews" className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
              Reviews
            </a>

            <div className="mt-3 border-t border-border pt-3">
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <button className="flex-1 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground">
                    Login
                  </button>
                  <button className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    Register
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <a href="#" className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
                    Dashboard
                  </a>
                  <a href="#" className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted">
                    My Profile
                  </a>
                  <button className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-muted">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
