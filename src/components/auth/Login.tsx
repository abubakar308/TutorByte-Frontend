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
} from "@/components/auth/AuthLayout";
import { loginUser } from "@/services/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password });

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create one free
        </Link>
      </p>
    </>
  );
}