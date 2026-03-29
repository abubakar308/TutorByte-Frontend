import { AuthShell } from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/Login";


export default function LoginPage() {
  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Welcome back.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue your learning journey.
        </p>
      </div>

      <LoginForm />
    </AuthShell>
  );
}