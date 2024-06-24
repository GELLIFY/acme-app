# load env
set -a
. .env
set +a

# setup
docker-compose up --wait -d

# db
pnpm db:push
pnpm db:seed

# run
#pnpm run dev