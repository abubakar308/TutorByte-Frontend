"use client";
import RegisterContent from "@/components/ui/auth/Register";
import {  Suspense } from "react";


export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
