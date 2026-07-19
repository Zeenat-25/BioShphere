// Database schema for BioSphere AI.
//
// Ships on SQLite (via better-sqlite3) so the app runs with zero external
// setup — no hosted database required for local dev or evaluation. For
// production, swap this file's imports from "drizzle-orm/sqlite-core" to
// "drizzle-orm/pg-core" and point src/db/client.ts at Postgres (Neon,
// Supabase, Vercel Postgres, etc.) using `drizzle-orm/postgres-js`. The
// query API used throughout the app (db.select/insert/update/delete) is
// identical across both drivers.

import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  farmName: text("farm_name"),
  experience: text("experience"), // "beginner" | "experienced" | null
  createdAt: text("created_at").notNull(),
});

export const outcomes = sqliteTable("outcomes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  crop: text("crop"),
  dateApplied: text("date_applied").notNull(),
  cropCondition: text("crop_condition").notNull(), // poor | fair | good | excellent
  yieldImprovementPct: real("yield_improvement_pct"),
  notes: text("notes"),
  farmerFeedback: text("farmer_feedback"),
  createdAt: text("created_at").notNull(),
});
