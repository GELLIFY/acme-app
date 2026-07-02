import { config } from "dotenv";

// Mirror next dev's env precedence for CLI tooling (drizzle-kit, tsx seed):
// .env.local (per-worktree, written by predev) overrides .env (shared
// secrets). Real process.env always wins — dotenv never overwrites
// existing variables — so the DATABASE_URL injected by provision-db.ts
// is preserved.
config({ path: [".env.local", ".env"], quiet: true });
