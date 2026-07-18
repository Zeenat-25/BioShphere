"use client";

// Minimal client-side auth/profile persistence so the product is fully
// demoable without a database. The surface area here (register/login/logout/
// getProfile/saveExperience) is intentionally small — replace the bodies with
// real API calls to your auth backend (NextAuth, Clerk, custom JWT, etc.)
// without touching any component that imports this module.

import type { ExperienceLevel, UserProfile } from "./types";

const USER_KEY = "biosphere.user";

export function register(name: string, email: string, farmName?: string): UserProfile {
  const profile: UserProfile = { name, email, farmName, experience: null, createdAt: new Date().toISOString() };
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  return profile;
}

export function login(email: string): UserProfile {
  const existing = getProfile();
  if (existing && existing.email === email) return existing;
  // Demo fallback: any email logs in as a fresh profile if none exists yet.
  const profile: UserProfile = { name: email.split("@")[0], email, experience: null, createdAt: new Date().toISOString() };
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  return profile;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveExperience(level: ExperienceLevel) {
  const profile = getProfile();
  if (!profile) return;
  profile.experience = level;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}
