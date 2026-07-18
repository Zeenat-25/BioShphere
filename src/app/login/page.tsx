"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard, AuthField } from "@/components/AuthCard";
import { login, getProfile } from "@/lib/biosphere/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const profile = login(email);
    setLoading(false);
    router.push(profile.experience ? "/mission-control" : "/onboarding");
    void getProfile;
    void password;
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
