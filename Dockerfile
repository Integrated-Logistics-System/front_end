# Multi-stage build for Next.js frontend
FROM node:24-alpine AS base

# Install system deps
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# ------------------------------
# Dependencies stage
# ------------------------------
FROM base AS deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ------------------------------
# Build stage
# ------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ------------------------------
# Production stage
# ------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

# System deps
RUN apk add --no-cache libc6-compat curl

# Non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app & node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]
