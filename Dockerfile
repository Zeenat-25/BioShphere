# syntax=docker/dockerfile:1

# ---- deps: install production-ready node_modules ----
FROM node:22-alpine AS deps
WORKDIR /app
# python3/make/g++ let better-sqlite3 build its native binding on Alpine/musl
# if no matching prebuilt binary is published for this platform.
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder: compile the Next.js standalone output ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal production image ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# NOTE on the database: this image ships the SQLite dev setup (dev.db,
# created on first run) for zero-config evaluation. A container's
# filesystem is ephemeral, so for production either mount a persistent
# volume at /app (so dev.db survives restarts) or switch to Postgres by
# editing src/db/schema.ts + src/db/client.ts and setting DATABASE_URL to
# a hosted instance (Neon, Supabase, Vercel Postgres, etc).

# Standalone output: server.js + minimal node_modules, then static assets + public.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
