# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml\* ./
RUN pnpm i

# Stage 2: Build the application
FROM node:20-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
RUN npm i -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ENV NEXT_TELEMETRY_DISABLED 1
RUN SKIP_ENV_VALIDATION=1 pnpm run build

# Stage 3: Production server
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["server.js"]
