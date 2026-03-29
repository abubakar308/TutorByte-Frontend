"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, Field, SubmitBtn, ErrorBox, OrDivider, GoogleBtn } from "@//components/auth/AuthLayout";

function RegisterContent() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "tutor" ? "TUTOR" : "STUDENT";
  const [role, setRole] = useState<"STUDENT" | "TUTOR">(defaultRole as any);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = role === "TUTOR" ? "/auth/register/tutor" : "/auth/register/student";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Create account.</h1>
        <p className="mt-2 text-muted-foreground text-sm">Join thousands of learners and tutors today.</p>
      </div>

      {/* Role toggle */}
      <div className="mb-6 flex rounded-xl border border-border bg-muted p-1">
        {(["STUDENT", "TUTOR"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
              role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r === "STUDENT" ? "👨‍🎓 Student" : "👨‍🏫 Tutor"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {error && <ErrorBox msg={error} />}
        <Field label="Full name" type="text" value={name} onChange={setName} placeholder="John Doe" />
        <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Min. 8 characters"
          hint="Must contain uppercase, lowercase, and a number."
        />
        <div className="mb-5" />
        <SubmitBtn loading={loading}>
          Create {role === "TUTOR" ? "Tutor" : "Student"} Account
        </SubmitBtn>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <OrDivider />
      <GoogleBtn />
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
