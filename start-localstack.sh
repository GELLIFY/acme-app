# load env
set -a
. .env
set +a

# setup - replaced by devcontainer
# docker-compose up -d --wait db neon-proxy 

# db
pnpm db:push
pnpm db:seed

# run
pnpm run dev

# for local first OTEL
# npm i -g @kubiks/cli
# kubiks
