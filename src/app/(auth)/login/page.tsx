"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell, Field, SubmitBtn, ErrorBox, OrDivider, GoogleBtn } from "@/components/auth/AuthLayout";

export default function LoginPage() {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      
      const role = data.data.user.role;
      router.push(role === "TUTOR" ? "/tutor/dashboard" : role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back.</h1>
        <p className="mt-2 text-muted-foreground text-sm">Sign in to continue your learning journey.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <ErrorBox msg={error} />}
        <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        <div className="mb-5 text-right">
          <Link href="/auth/forgot-password" hidden className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
        </div>
        <SubmitBtn loading={loading}>Sign in</SubmitBtn>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">Create one free</Link>
      </p>
      <OrDivider />
      <GoogleBtn />
    </AuthShell>
  );
}
