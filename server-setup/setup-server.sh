#!/bin/bash
# This script should be run on your server (VPS) as root

set -e

echo "🚀 Setting up LTQ Sites deployment server..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "📦 Installing Nginx, Git, and other dependencies..."
apt install -y nginx git rsync curl

# Create web directory
echo "📁 Creating web directory..."
mkdir -p /var/www/letstradequotex.com
chown -R www-data:www-data /var/www/letstradequotex.com
chmod -R 755 /var/www/letstradequotex.com

# Create snippets directory if not exists
mkdir -p /etc/nginx/snippets

# Copy deploy script to root home (you'll need to upload it first)
echo "📄 Setting up deployment script..."
cat > /root/deploy-ltq.sh << 'DEPLOY_SCRIPT'
#!/bin/bash

set -e

REPO_DIR="/tmp/html-sites-deploy"
SITES_DIR="/var/www/letstradequotex.com"

echo "Starting deployment..."

# Clean up previous deployment
rm -rf $REPO_DIR

# Clone the repository using SSH
git clone git@github.com:frog-sand/Lets-Trade-Quotex-LP.git $REPO_DIR

# Copy sites to web directory (from sites/ folder)
mkdir -p $SITES_DIR
rsync -av --delete $REPO_DIR/sites/ $SITES_DIR/
chown -R www-data:www-data $SITES_DIR
chmod -R 755 $SITES_DIR

# Generate new Nginx configuration
bash $REPO_DIR/scripts/generate-nginx-config.sh

# Test Nginx configuration
nginx -t

# Reload Nginx if test passes
systemctl reload nginx

echo "✅ Deployment completed successfully!"

# List deployed sites
echo "Currently deployed sites:"
ls -la $SITES_DIR/
DEPLOY_SCRIPT

chmod +x /root/deploy-ltq.sh

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Add GitHub deploy key to server"
echo "2. Copy nginx config to /etc/nginx/sites-available/"
echo "3. Enable the site and restart nginx"
echo "4. Configure GitHub secrets for auto-deployment"
