"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, Field, SubmitBtn, ErrorBox } from "@/components/ui/auth/AuthLayout";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      setDone(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      {!done ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-foreground">New password.</h1>
            <p className="mt-2 text-muted-foreground text-sm">Choose a strong password for your account.</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <ErrorBox msg={error} />}
            <Field
              label="New password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Min. 8 characters"
              hint="Must contain uppercase, lowercase, and a number."
            />
            <Field
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Re-enter password"
            />
            <div className="mb-5" />
            <SubmitBtn loading={loading}>Reset password</SubmitBtn>
          </form>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mb-6 text-6xl">✅</div>
          <h2 className="text-2xl font-black text-foreground mb-3">Password reset!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your password has been updated successfully.
            <br />
            Redirecting you to sign in...
          </p>
        </div>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
