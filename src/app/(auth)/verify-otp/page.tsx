"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthShell, ErrorBox, SubmitBtn } from "@/components/ui/auth/AuthLayout";

function VerifyOtpContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) setOtp(text.split(""));
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const code = otp.join("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      router.push(`/auth/reset-password?token=${data.data.resetToken}`);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Try again.");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.join("").length === 6;

  return (
    <AuthShell>
      <Link
        href="/auth/forgot-password"
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition w-fit group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to reset email
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Verify OTP.</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Sent to <span className="font-bold text-foreground">{email}</span>. Expires in 10 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <ErrorBox msg={error} />}

        {/* OTP boxes */}
        <div className="flex gap-2 sm:gap-3 justify-center mb-8" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              inputMode="numeric"
              className={`h-14 w-11 sm:w-12 rounded-xl border-2 bg-card text-center text-xl font-black text-foreground outline-none transition-all duration-200 ${
                digit ? "border-primary bg-primary/5" : "border-border"
              } focus:border-primary focus:ring-4 focus:ring-primary/10`}
            />
          ))}
        </div>

        <SubmitBtn loading={loading}>
          {isComplete ? (loading ? "Verifying..." : "Verify OTP") : "Enter all 6 digits"}
        </SubmitBtn>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground font-medium">
        Didn't receive it?{" "}
        <button
          type="button"
          onClick={() => fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
             method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, type: "reset" })
          })}
          className="font-bold text-primary hover:underline transition"
        >
          Resend OTP
        </button>
      </p>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
