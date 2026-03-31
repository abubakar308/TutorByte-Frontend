"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell, Field, SubmitBtn, ErrorBox } from "@/components/ui/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Link
        href="/auth/login"
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition w-fit group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to sign in
      </Link>

      {!sent ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Forgot password.</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              Enter your email and we'll send a 6-digit OTP to reset it.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <ErrorBox msg={error} />}
            <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <div className="mb-5" />
            <SubmitBtn loading={loading}>Send OTP</SubmitBtn>
          </form>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="mb-6 text-6xl">📬</div>
          <h2 className="text-2xl font-black text-foreground mb-3">Check your inbox.</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            We sent a 6-digit OTP to <span className="font-bold text-foreground">{email}</span>. It expires in 10
            minutes.
          </p>
          <Link
            href={`/auth/verify-otp?email=${encodeURIComponent(email)}&type=reset`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Enter OTP →
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
