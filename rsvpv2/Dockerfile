# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Prisma validates the datasource during image builds as well as at runtime.
# Render replaces this placeholder with the real database URL at runtime.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build

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

# Create a non-root user for security.
# /app is chowned once (single dir, cheap) so the app user can run npm ci.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown nextjs:nodejs /app

ENV HOME=/app

# Install production dependencies as the app user so node_modules is owned
# by nextjs from the start. Avoids a recursive chown of the whole tree,
# which triggers a pathological overlayfs copy-up that can hang the build.
USER nextjs

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

EXPOSE 3000

# Apply pending migrations before starting the Next.js server.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
