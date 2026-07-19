"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthCard, AuthField } from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/mission-control";
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <AuthCard
      title="Log in"
      subtitle="Access your Mission Control dashboard."
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Request access
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          type="email"
          required
          placeholder="you@farm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-xs text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-accent text-panel text-sm font-medium py-2.5 hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
