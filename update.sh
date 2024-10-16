#!/bin/bash

# Script Vars
REPO_URL="git@github.com:GELLIFY/acme-app.git"
BRANCH_NAME=feature/self-host
APP_DIR=~/acme-app

# Pull the latest changes from the Git repository
if [ -d "$APP_DIR" ]; then
  echo "Pulling latest changes from the repository..."
  cd $APP_DIR
  git fetch origin
  git checkout $BRANCH_NAME
  git pull origin $BRANCH_NAME
else
  echo "Cloning repository from $REPO_URL (branch: $BRANCH_NAME)..."
  git clone --branch $BRANCH_NAME $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# Build and restart the Docker containers from the app directory (~/acme-app)
echo "Rebuilding and restarting Docker containers..."
sudo docker-compose down
sudo docker-compose up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Update complete. Your Next.js app has been deployed with the latest changes."
