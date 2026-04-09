"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Field,
  SubmitBtn,
  ErrorBox,
  OrDivider,
  GoogleBtn,
} from "@/components/ui/auth/AuthLayout";
import { loginUser } from "@/services/auth";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        toast.success(result.message || "Welcome back! Login successful.");
        router.push("/");
        router.refresh();
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Demo credential handler
  const fillDemo = (email: string, password: string, role: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Welcome back.
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Sign in to continue your learning journey.
        </p>
      </div>

      {/* 🔥 Demo Credentials */}
      <div className="mb-6 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Demo Accounts
        </p>

        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() =>
              fillDemo("admin@tutorbyte.com", "adminpassword", "Admin")
            }
            className="w-full rounded-xl border border-border px-3 py-2 text-sm text-left hover:bg-muted transition"
          >
            🔐 Admin Login
          </button>

          <button
            type="button"
            onClick={() =>
              fillDemo("anisul@gmail.com", "Anisul12", "Tutor")
            }
            className="w-full rounded-xl border border-border px-3 py-2 text-sm text-left hover:bg-muted transition"
          >
            🎓 Tutor Login
          </button>

          <button
            type="button"
            onClick={() =>
              fillDemo("abubakar1@gmail.com", "Abubakar1", "Student")
            }
            className="w-full rounded-xl border border-border px-3 py-2 text-sm text-left hover:bg-muted transition"
          >
            👨‍🎓 Student Login
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <ErrorBox msg={error} />}

        <Field
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        <div className="mb-5 text-right">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitBtn loading={loading}>Sign in</SubmitBtn>
      </form>

      <OrDivider />
      <GoogleBtn />

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create one free
        </Link>
      </p>
    </>
  );
}