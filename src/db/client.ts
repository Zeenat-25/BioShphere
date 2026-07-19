import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_URL?.replace(/^file:/, "") || "./dev.db";

// Reuse a single connection across hot reloads in dev.
declare global {
  // eslint-disable-next-line no-var
  var __biosphereSqlite: Database.Database | undefined;
}

const sqlite = global.__biosphereSqlite ?? new Database(DB_PATH);
if (process.env.NODE_ENV !== "production") global.__biosphereSqlite = sqlite;

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Create tables if they don't exist yet — keeps first-run setup to zero
// commands. For schema changes after that, use `npm run db:push`.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    farm_name TEXT,
    experience TEXT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS outcomes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    crop TEXT,
    date_applied TEXT NOT NULL,
    crop_condition TEXT NOT NULL,
    yield_improvement_pct REAL,
    notes TEXT,
    farmer_feedback TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS outcomes_user_id_idx ON outcomes(user_id);
`);

export const db = drizzle(sqlite, { schema });
