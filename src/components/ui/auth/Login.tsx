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
import { toast } from "sonner"; // Sonner ইম্পোর্ট করুন

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ১. বেসিক ভ্যালিডেশন
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        // ২. সাকসেস টোস্ট
        toast.success(result.message || "Welcome back! Login successful.");
        
        // ৩. রিডাইরেক্ট এবং রিফ্রেশ
        router.push("/");
        router.refresh();
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      // ৪. এরর হ্যান্ডলিং
      setError(err.message || "Login failed. Please try again.");
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back.</h1>
        <p className="mt-2 text-muted-foreground text-sm">Sign in to continue your learning journey.</p>
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
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create one free
        </Link>
      </p>
    </>
  );
}