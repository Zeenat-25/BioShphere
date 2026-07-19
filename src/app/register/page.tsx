"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthCard, AuthField } from "@/components/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [farmName, setFarmName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, farmName: farmName || undefined }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong creating your account.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("Account created, but automatic sign-in failed. Please log in.");
      router.push("/login");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  };

  return (
    <AuthCard
      title="Request access"
      subtitle="Create your BioSphere AI account."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthField label="Full name" required placeholder="Jordan Alvarez" value={name} onChange={(e) => setName(e.target.value)} />
        <AuthField
          label="Email"
          type="email"
          required
          placeholder="you@farm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="Farm / organization (optional)"
          placeholder="Alvarez Family Farm"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
        />
        <AuthField
          label="Password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-accent text-panel text-sm font-medium py-2.5 hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
