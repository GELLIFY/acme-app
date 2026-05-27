# load env
set -a
. .env
set +a

# shared Postgres (one instance for all worktrees)
docker-compose up -d --wait db

# run (predev provisions this worktree's database, then portless serves it)
pnpm run dev

# for local first OTEL
# npm i -g @kubiks/cli
# kubiks
