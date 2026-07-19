"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard, AuthField } from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthCard
      title="Reset password"
      subtitle="We'll send a reset link to your email."
      footer={
        <Link href="/login" className="text-accent hover:underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground">
          If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <AuthField
            label="Email"
            type="email"
            required
            placeholder="you@farm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-accent text-panel text-sm font-medium py-2.5 hover:opacity-90 transition"
          >
            Send reset link
          </button>
        </form>
      )}
    </AuthCard>
  );
}
