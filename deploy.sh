#!/bin/bash

# Env Vars
POSTGRES_DB="acme-app"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password" # $(openssl rand -base64 12) # Generate a random 12-character password
AUTH_SECRET="supersecret" # for the demo app
AUTH_URL=http://acme-app.gellify.dev # replace with your own domain or ip
KEYCLOAK_ADMIN="admin"
KEYCLOAK_ADMIN_PASSWORD="password"
KEYCLOAK_CLIENT_ID="nextjs"
KEYCLOAK_CLIENT_SECRET="secret"
KEYCLOAK_ISSUER="http://acme-app.gellify.dev/auth/realms/local"
NEXT_PUBLIC_CLIENTVAR="not_so_secret_key" # for the demo app
DOMAIN_NAME="acme-app.gellify.dev" # replace with your own domain or ip
EMAIL="matteo.badini@gellify.com" # replace with your own

# Script Vars
REPO_URL="git@github.com:GELLIFY/acme-app.git"
BRANCH_NAME=feature/self-host
APP_DIR=~/acme-app
SWAP_SIZE="1G"  # Swap size of 1GB

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Add Swap Space
echo "Adding swap space..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
sudo apt update
sudo apt install docker-ce -y

# Install Docker Compose
sudo rm -f /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Wait for the file to be fully downloaded before proceeding
if [ ! -f /usr/local/bin/docker-compose ]; then
  echo "Docker Compose download failed. Exiting."
  exit 1
fi

sudo chmod +x /usr/local/bin/docker-compose

# Ensure Docker Compose is executable and in path
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify Docker Compose installation
docker-compose --version
if [ $? -ne 0 ]; then
  echo "Docker Compose installation failed. Exiting."
  exit 1
fi

# Ensure Docker starts on boot and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Clone the Git repository or pull latest changes
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists. Pulling latest changes from branch $BRANCH_NAME..."
  cd $APP_DIR
  git fetch origin
  git checkout $BRANCH_NAME
  git pull origin $BRANCH_NAME
else
  echo "Cloning repository from $REPO_URL (branch: $BRANCH_NAME)..."
  git clone --branch $BRANCH_NAME $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# For Docker internal communication ("postgres" is the name of Postgres container)
DATABASE_URL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres:5432/$POSTGRES_DB"

# For external tools (like Drizzle Studio)
DATABASE_URL_EXTERNAL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB"

# Create the .env file inside the app directory (~/acme-app/.env)
echo "POSTGRES_USER=$POSTGRES_USER" > "$APP_DIR/.env"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> "$APP_DIR/.env"
echo "POSTGRES_DB=$POSTGRES_DB" >> "$APP_DIR/.env"
echo "DATABASE_URL=$DATABASE_URL" >> "$APP_DIR/.env"
echo "DATABASE_URL_EXTERNAL=$DATABASE_URL_EXTERNAL" >> "$APP_DIR/.env"

# These are for next-auth
echo "AUTH_SECRET=$AUTH_SECRET" >> "$APP_DIR/.env"
echo "AUTH_URL=$AUTH_URL" >> "$APP_DIR/.env"

# These are for Keycloak
echo "KEYCLOAK_ADMIN=$KEYCLOAK_ADMIN" >> "$APP_DIR/.env"
echo "KEYCLOAK_ADMIN_PASSWORD=$KEYCLOAK_ADMIN_PASSWORD" >> "$APP_DIR/.env"
echo "KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID" >> "$APP_DIR/.env"
echo "KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET" >> "$APP_DIR/.env"
echo "KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER" >> "$APP_DIR/.env"

# These are just for the demo of env vars
echo "NEXT_PUBLIC_CLIENTVAR=$NEXT_PUBLIC_CLIENTVAR" >> "$APP_DIR/.env"

# Install Nginx
sudo apt install nginx -y

# Remove old Nginx config (if it exists)
sudo rm -f /etc/nginx/sites-available/acme-app
sudo rm -f /etc/nginx/sites-enabled/acme-app

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Obtain SSL certificate using Certbot standalone mode
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo cat > /etc/nginx/sites-available/acme-app <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=25r/s;

server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=50 nodelay;
    limit_req_status 429;

    # Serve Next.js app at the root (default location '/')
    location / {
        proxy_pass http://localhost:3000; # Next.js app running on port 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }

    # Serve Keycloak from /auth
    location /auth/ {
        proxy_pass http://localhost:8080/auth/; # Keycloak instance running on port 8080
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Host \$host;
    }
}
EOL

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/acme-app /etc/nginx/sites-enabled/acme-app

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx

# Build and run the Docker containers from the app directory (~/acme-app)
cd $APP_DIR
sudo docker-compose up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Deployment complete. Your Next.js app and PostgreSQL database are now running. 
Next.js is available at https://$DOMAIN_NAME, and the PostgreSQL database is accessible from the web service.

The .env file has been created with the following values:
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD (randomly generated)
- DATABASE_URL
- DATABASE_URL_EXTERNAL
- AUTH_SECRET
- AUTH_URL
- KEYCLOAK_ADMIN
- KEYCLOAK_ADMIN_PASSWORD
- KEYCLOAK_CLIENT_ID
- KEYCLOAK_CLIENT_SECRET
- KEYCLOAK_ISSUER
- NEXT_PUBLIC_CLIENTVAR"