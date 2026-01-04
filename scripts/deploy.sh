#!/bin/bash

set -e

REPO_DIR="/tmp/html-sites-deploy"
SITES_DIR="/var/www/letstradequotex.com"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting deployment..."

# Clean up previous deployment
rm -rf $REPO_DIR

# Clone the repository using SSH
git clone git@github.com:frog-sand/Lets-Trade-Quotex-LP.git $REPO_DIR

# Copy sites to web directory (from sites/ folder)
sudo mkdir -p $SITES_DIR
sudo rsync -av --delete $REPO_DIR/sites/ $SITES_DIR/
sudo chown -R nginx:nginx $SITES_DIR
sudo chmod -R 755 $SITES_DIR

# Generate new Nginx configuration using the cloned script
bash $REPO_DIR/scripts/generate-nginx-config.sh

# Test Nginx configuration
sudo nginx -t

# Reload Nginx if test passes
sudo systemctl reload nginx

echo "Deployment completed successfully!"

# List deployed sites
echo "Currently deployed sites:"
ls -la $SITES_DIR/
