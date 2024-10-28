FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml\* ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
