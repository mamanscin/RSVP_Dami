# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generate the Prisma client and build the Next.js app
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Install production dependencies (including prisma & @prisma/client for
# runtime migrations)
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy the Prisma-generated client (engine binaries, etc.)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy the Prisma schema and migration files
COPY --from=builder /app/prisma ./prisma

# Copy the built Next.js application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Create the data directory for the SQLite database. Make it world-writable
# so the nextjs user can write even when the Docker volume is root-owned.
RUN mkdir -p /data && chmod 777 /data && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# On startup, apply any pending database migrations (or push the schema if
# no migrations exist yet), then start the Next.js server.
CMD ["sh", "-c", "npx prisma migrate deploy 2>/dev/null || npx prisma db push && npm start"]
