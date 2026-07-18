"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard, AuthField } from "@/components/AuthCard";
import { register } from "@/lib/biosphere/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [farmName, setFarmName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    register(name, email, farmName || undefined);
    setLoading(false);
    router.push("/onboarding");
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
