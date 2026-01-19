# Build and run

This repo uses pnpm (packageManager pinned in package.json).

## Common commands

- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start prod: `pnpm start`
- Typecheck: `pnpm typecheck` (runs Next.js typegen and `tsc --noEmit`)
- Lint: `pnpm lint` (Biome)
- Format: `pnpm format` (Biome)
- Tests: `pnpm test` (runs `bun test`)

## Other useful scripts

- Database: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:seed`
- Auth schema generation: `pnpm auth:generate`
- Email dev server: `pnpm email:dev` (port 3001)
- Clean build artifacts: `pnpm clean`
