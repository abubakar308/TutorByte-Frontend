"use client";
import React, { useState } from "react";
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react";

// ── Shared layout ─────────────────────────────────────────────

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, white 0%, transparent 50%)" }} />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary/30 blur-2xl translate-y-1/2 -translate-x-1/2" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">TutorByte</span>
        </div>

        {/* Quote */}
        <div className="relative">
          <div className="text-6xl text-white/20 font-black leading-none mb-4">"</div>
          <blockquote className="text-2xl font-medium text-white/90 leading-snug mb-4">
            The best investment you can make is in yourself.
          </blockquote>
          <p className="text-white/50 text-sm">— Warren Buffett</p>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {[{ n: "12K+", l: "Tutors" }, { n: "98K+", l: "Sessions" }, { n: "4.9★", l: "Rating" }].map(s => (
            <div key={s.l} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center">
              <div className="text-xl font-black text-white">{s.n}</div>
              <div className="text-xs text-white/60 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}

// ── Shared input ──────────────────────────────────────────────

export function Field({ label, type, value, onChange, placeholder, hint }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <div className={`flex items-center rounded-xl border bg-card transition-all duration-200 ${focused ? "border-primary ring-2 ring-primary/15" : "border-border"}`}>
        <input type={isPassword && show ? "text" : type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none" />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="pr-3 text-muted-foreground hover:text-foreground transition">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SubmitBtn({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
      {msg}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground">or continue with</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function GoogleBtn() {
  return (
    <button type="button"
      className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted hover:border-primary/30">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
}
